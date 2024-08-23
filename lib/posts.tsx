import fs from "fs";
import path from "path";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { remarkAlert } from "remark-github-blockquote-alert";
import { h } from "hastscript";

import type { VFile } from "vfile";

/** @type {import("unified").Plugin<[{ legacyTitle: boolean }]>} */
function remarkAlertFixed(options: any) {
  // @ts-ignore
  return remarkAlert(options);
}

type Post = {
  title: string;
  date: Date;
  slug: string;
  content: string;
  excerpt: string;
  unprocessedExcerpt: string;
  readingTime: number;
  wordCount: number;
};

type FrontMatter = {
  title: string;
  date: string;
  excerpt: string;
};

export async function fetchPosts(): Promise<Post[]> {
  const slugs = await fs.promises.readdir(path.join(process.cwd(), "posts"));
  const posts = await Promise.all(slugs.map((slug) => fetchPost(slug)));
  posts.sort((a, b) => {
    return b.date.getTime() - a.date.getTime();
  });
  return posts;
}

async function parsePostFile(slug: string): Promise<VFile> {
  const contentPath = path.join(process.cwd(), "posts", slug, "index.md");
  const file = await read(contentPath);

  matter(file, { strip: true });

  return file;
}

export async function fetchPost(slug: string): Promise<Post> {
  const file = await parsePostFile(slug);

  const { title, date, excerpt }: FrontMatter = file.data.matter as any;

  const content = await fetchPostContent(slug);
  const parsedExcerpt = await parseMarkdownContent(excerpt);
  const wordCount = content.trim().split(/\s+/).length;
  const wordsPerMinute = 238;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return {
    title,
    date: new Date(date),
    slug,
    content,
    excerpt: parsedExcerpt,
    unprocessedExcerpt: excerpt,
    readingTime,
    wordCount,
  };
}

async function parseMarkdownContent(content: string): Promise<string> {
  const output = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkAlertFixed, { legacyTitle: true })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      headingProperties: {
        class: "heading-group group",
      },
      content(node: h.JSX.Element) {
        return [h("span.heading-link", "#"), ...node.children];
      },
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(String(content));

  return String(output);
}

export async function fetchPostContent(slug: string): Promise<string> {
  const file = await parsePostFile(slug);
  return parseMarkdownContent(String(file));
}
