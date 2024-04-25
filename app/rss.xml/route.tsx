import { Feed } from 'feed';
import { fetchPosts } from '@/lib/posts';

import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const posts = await fetchPosts();
  const lastUpdated = posts.reduce((acc, post) => {
    const postDate = new Date(post.date);
    return postDate > acc ? postDate : acc;
  }, new Date('1970-01-01'));

  const feed = new Feed({
    title: `Eli Perkins's Blog`,
    description: 'A bunch of ramblings from Eli Perkins',
    id: 'https://blog.eliperkins.com',
    link: 'https://blog.eliperkins.com',
    language: 'en',
    favicon: 'https://blog.eliperkins.com/favicon.ico',
    feedLinks: {
      rss: 'https://blog.eliperkins.com/rss.xml',
    },
    copyright: 'All rights reserved 2024, Eli Perkins',
    generator: 'Next.js+Feed',
    updated: lastUpdated,
    author: {
      name: 'Eli Perkins',
      email: 'eli.j.perkins@gmail.com',
      link: 'https://eliperkins.com',
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `https://blog.eliperkins.com/${post.slug}`,
      link: `https://blog.eliperkins.com/${post.slug}`,
      description: post.excerpt,
      content: post.content,
      author: [
        {
          name: 'Eli Perkins',
          email: 'eli.j.perkins@gmail.com',
        },
      ],
      date: new Date(post.date),
    });
  });

  return new NextResponse(feed.rss2());
}
