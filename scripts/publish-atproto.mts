import fs from "fs";
import path from "path";
import { AtpAgent, BlobRef } from "@atproto/api";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { toString as mdastToString } from "mdast-util-to-string";

const COLLECTION = "site.standard.document";
const BASE32_SORT = "234567abcdefghijklmnopqrstuvwxyz";

type StrongRef = {
  uri: string;
  cid: string;
};

type DocumentRecord = {
  $type: typeof COLLECTION;
  title: string;
  path: string;
  publishedAt: string;
  description: string;
  textContent: string;
  site: string;
  bskyPostRef?: StrongRef;
};

type ExistingRecord = { comparable: DocumentRecord; coverImage?: BlobRef };

interface PostMetadata {
  slug: string;
  title: string;
  date: Date;
  publishedAt: string;
  description: string;
  textContent: string;
  blueskyPostID?: string;
}

function encodeBase32Sort(value: bigint, length: number): string {
  const chars: string[] = [];
  let v = value;
  for (let i = 0; i < length; i++) {
    chars.unshift(BASE32_SORT[Number(v & 31n)]);
    v >>= 5n;
  }
  return chars.join("");
}

async function tidFromDateAndString(date: Date, str: string): Promise<string> {
  const dateMs = Math.floor(date.getTime() / 1000) * 1000;
  const microseconds = BigInt(dateMs) * 1000n;
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str),
  );
  const clockId = BigInt(new DataView(hashBuffer).getUint16(0)) & 0x3ffn;
  return encodeBase32Sort((microseconds << 10n) | clockId, 13);
}

async function fetchPostsMetadata(): Promise<PostMetadata[]> {
  const slugs = await fs.promises.readdir(path.join(process.cwd(), "posts"));
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const file = await read(
        path.join(process.cwd(), "posts", slug, "index.md"),
      );
      matter(file, { strip: true });
      const { title, date, excerpt, blueskyPostID } = file.data.matter as {
        title: string;
        date: string;
        excerpt: string;
        blueskyPostID?: string;
      };

      // normalize to UTC midnight for consistent TID and rkeys
      const utcDate = new Date(`${date.toString().slice(0, 10)}T00:00:00.000Z`);

      const tree = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .parse(String(file));
      const description = String(
        await unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkRehype)
          .use(rehypeStringify)
          .process(excerpt),
      );
      const textContent = mdastToString(tree);

      return {
        slug,
        title,
        date: utcDate,
        publishedAt: utcDate.toISOString(),
        description,
        textContent,
        blueskyPostID,
      };
    }),
  );
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
}

async function main() {
  const identifier = process.env.ATPROTO_IDENTIFIER;
  const password = process.env.ATPROTO_APP_PASSWORD;

  if (!identifier || !password) {
    console.error(
      "ATPROTO_IDENTIFIER and ATPROTO_APP_PASSWORD env vars are required",
    );
    process.exit(1);
  }

  const siteUri = fs
    .readFileSync(
      path.join(process.cwd(), "public/.well-known/site.standard.publication"),
      "utf-8",
    )
    .trim();

  const agent = new AtpAgent({ service: "https://bsky.social" });
  await agent.login({ identifier, password });
  const did = agent.assertDid;

  const existingByRkey = new Map<string, ExistingRecord>();
  let cursor: string | undefined;
  do {
    const { data } = await agent.com.atproto.repo.listRecords({
      repo: did,
      collection: COLLECTION,
      limit: 100,
      ...(cursor ? { cursor } : {}),
    });
    for (const record of data.records) {
      const rkey = record.uri.split("/").at(-1)!;
      const v = record.value;
      if (typeof v.path !== "string") continue;
      existingByRkey.set(rkey, {
        comparable: {
          $type: COLLECTION,
          title: v.title as string,
          path: v.path,
          publishedAt: v.publishedAt as string,
          description: (v.description ?? "") as string,
          textContent: (v.textContent ?? "") as string,
          site: v.site as string,
          ...(v.bskyPostRef ? { bskyPostRef: v.bskyPostRef as StrongRef } : {}),
        },
        coverImage: v.coverImage as BlobRef | undefined,
      });
    }
    cursor = data.cursor;
  } while (cursor);

  const posts = await fetchPostsMetadata();

  for (const post of posts) {
    const postPath = `/${post.slug}`;
    const rkey = await tidFromDateAndString(post.date, postPath);
    const existing = existingByRkey.get(rkey);

    let bskyPostRef = existing?.comparable.bskyPostRef;
    if (!bskyPostRef && post.blueskyPostID) {
      const { data } = await agent.com.atproto.repo.getRecord({
        repo: did,
        collection: "app.bsky.feed.post",
        rkey: post.blueskyPostID,
      });
      bskyPostRef = { uri: data.uri, cid: data.cid! };
    }

    const newRecord: DocumentRecord = {
      $type: COLLECTION,
      title: post.title,
      path: postPath,
      publishedAt: post.publishedAt,
      description: post.description,
      textContent: post.textContent,
      site: siteUri,
      ...(bskyPostRef ? { bskyPostRef } : {}),
    };

    const ogImagePath = path.join(
      process.cwd(),
      "out",
      post.slug,
      "opengraph-image",
    );
    const hasLocalOgImage = fs.existsSync(ogImagePath);
    const needsCoverImage = !existing?.coverImage && hasLocalOgImage;

    if (
      existing &&
      JSON.stringify(newRecord) === JSON.stringify(existing.comparable) &&
      !needsCoverImage
    ) {
      continue;
    }

    let coverImage: BlobRef | undefined = existing?.coverImage;
    if (!coverImage && hasLocalOgImage) {
      const { data } = await agent.uploadBlob(fs.readFileSync(ogImagePath), {
        encoding: "image/png",
      });
      coverImage = data.blob;
    }

    const { data } = await agent.com.atproto.repo.putRecord({
      repo: did,
      collection: COLLECTION,
      rkey,
      record: { ...newRecord, ...(coverImage ? { coverImage } : {}) },
    });
    console.log(`${existing ? "Updated" : "Published"}: ${data.uri}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
