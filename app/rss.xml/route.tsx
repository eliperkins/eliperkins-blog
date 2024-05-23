import { Feed } from "feed";
import { NextResponse } from "next/server";
import { fetchPosts } from "@/lib/posts";

export async function GET() {
  const posts = await fetchPosts();
  const lastUpdated = posts[0].date;

  const feed = new Feed({
    title: `Eli Perkins's Blog`,
    description: "A bunch of ramblings from Eli Perkins",
    id: "https://blog.eliperkins.com",
    link: "https://blog.eliperkins.com",
    language: "en",
    favicon: "https://blog.eliperkins.com/favicon.ico",
    feedLinks: {
      rss: "https://blog.eliperkins.com/rss.xml",
    },
    copyright: "All rights reserved 2024, Eli Perkins",
    generator: "Next.js+Feed",
    updated: lastUpdated,
    author: {
      name: "Eli Perkins",
      email: "eli.j.perkins@gmail.com",
      link: "https://eliperkins.com",
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
          name: "Eli Perkins",
          email: "eli.j.perkins@gmail.com",
        },
      ],
      date: new Date(post.date),
    });
  });

  return new NextResponse(feed.rss2());
}
