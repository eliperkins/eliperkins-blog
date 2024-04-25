import fs from 'fs';
import path from 'path';
import { read } from 'to-vfile';
import { matter } from 'vfile-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

import type { VFile } from 'vfile';

type Post = {
  title: string;
  date: string;
  slug: string;
};

export async function fetchPosts(): Promise<Post[]> {
  const slugs = await fs.promises.readdir(path.join(process.cwd(), 'posts'));
  const posts = Promise.all(slugs.map((slug) => fetchPost(slug)));
  return posts;
}

async function parsePostFile(slug: string): Promise<VFile> {
  const contentPath = path.join(process.cwd(), 'posts', slug, 'index.md');
  const file = await read(contentPath);

  matter(file, { strip: true });

  return file;
}

export async function fetchPost(slug: string): Promise<Post> {
  const file = await parsePostFile(slug);

  const { title, date }: { title: string; date: string } = file.data
    .matter as any;

  return {
    title,
    date,
    slug,
  };
}

export async function fetchPostContent(slug: string): Promise<string> {
  const file = await parsePostFile(slug);

  const output = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(String(file));

  return String(output);
}
