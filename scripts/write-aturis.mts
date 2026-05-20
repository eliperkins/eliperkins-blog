import fs from "fs";
import path from "path";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import { tidFromDateAndPath, didFromAtUri } from "../lib/atproto.ts";

const COLLECTION = "site.standard.document";

async function main() {
  const siteUri = fs
    .readFileSync(
      path.join(process.cwd(), "public/.well-known/site.standard.publication"),
      "utf-8",
    )
    .trim();
  const did = didFromAtUri(siteUri);

  const slugs = await fs.promises.readdir(path.join(process.cwd(), "posts"));

  await Promise.all(
    slugs.map(async (slug) => {
      const filePath = path.join(process.cwd(), "posts", slug, "index.md");
      const file = await read(filePath);
      matter(file, { strip: false });
      const { date, atUri } = file.data.matter as {
        date: string;
        atUri?: string;
      };

      if (atUri) return;

      const utcDate = new Date(`${date.slice(0, 10)}T00:00:00.000Z`);
      const rkey = await tidFromDateAndPath(utcDate, `/${slug}`);
      const uri = `at://${did}/${COLLECTION}/${rkey}`;

      const content = String(file.value);
      const closingDashes = content.indexOf("---", 3);
      fs.writeFileSync(
        filePath,
        content.slice(0, closingDashes) +
          `atUri: ${uri}\n` +
          content.slice(closingDashes),
      );
      console.log(`Wrote atUri for ${slug}: ${uri}`);
    }),
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
