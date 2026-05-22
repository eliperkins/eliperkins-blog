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
import { tidFromDateAndPath } from "../lib/atproto.ts";

const COLLECTION = "site.standard.document";

interface StrongRef {
  uri: string;
  cid: string;
}

interface DocumentRecord {
  $type: typeof COLLECTION;
  title: string;
  path: string;
  publishedAt: string;
  description: string;
  textContent: string;
  site: string;
  bskyPostRef?: StrongRef;
}

interface ExistingRecord {
  comparable: DocumentRecord;
  coverImage?: BlobRef;
}

interface PostMetadata {
  slug: string;
  title: string;
  date: Date;
  publishedAt: string;
  description: string;
  textContent: string;
  blueskyPostID?: string;
  atUri?: string;
}

async function fetchPostsMetadata(): Promise<PostMetadata[]> {
  const slugs = await fs.promises.readdir(path.join(process.cwd(), "posts"));
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const file = await read(
        path.join(process.cwd(), "posts", slug, "index.md"),
      );
      matter(file, { strip: true });
      const { title, date, excerpt, blueskyPostID, atUri } = file.data
        .matter as {
        title: string;
        date: string;
        excerpt: string;
        blueskyPostID?: string;
        atUri?: string;
      };

      // normalize to UTC midnight for consistent TID and rkeys
      const utcDate = new Date(`${date.slice(0, 10)}T00:00:00.000Z`);

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
        atUri,
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
      const rkey = record.uri.split("/").at(-1);
      if (!rkey) continue;
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
    const rkey = await tidFromDateAndPath(post.date, postPath);
    const atUri = `at://${did}/${COLLECTION}/${rkey}`;

    if (post.atUri && post.atUri !== atUri) {
      console.error(
        `atUri mismatch for ${post.slug}:\n  frontmatter: ${post.atUri}\n  computed:    ${atUri}`,
      );
      process.exit(1);
    }

    const existing = existingByRkey.get(rkey);

    let bskyPostRef = existing?.comparable.bskyPostRef;
    if (!bskyPostRef && post.blueskyPostID) {
      const { data } = await agent.com.atproto.repo.getRecord({
        repo: did,
        collection: "app.bsky.feed.post",
        rkey: post.blueskyPostID,
      });
      if (data.cid) {
        bskyPostRef = { uri: data.uri, cid: data.cid };
      }
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

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
