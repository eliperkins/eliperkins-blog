"use client";

import { useEffect } from "react";

declare global {
  interface ModelContext {
    registerTool(tool: {
      name: string;
      description: string;
      parameters?: Record<string, unknown>;
      handler: (params?: Record<string, unknown>) => unknown;
    }): void;
  }
  interface Navigator {
    modelContext?: ModelContext;
  }
}

interface PostSummary {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  readingTime: number;
}

const WebMCP = ({ posts }: { readonly posts: PostSummary[] }) => {
  useEffect(() => {
    if (!navigator.modelContext) return;

    navigator.modelContext.registerTool({
      name: "list_posts",
      description:
        "Returns a list of all blog posts by Eli Perkins with titles, dates, excerpts, and reading times",
      handler: () => ({
        posts: posts.map((p) => ({
          title: p.title,
          slug: p.slug,
          date: p.date,
          excerpt: p.excerpt,
          readingTime: p.readingTime,
          url: `https://blog.eliperkins.com/${p.slug}`,
          markdownUrl: `https://blog.eliperkins.com/posts/${p.slug}.md`,
        })),
      }),
    });

    navigator.modelContext.registerTool({
      name: "get_post_content",
      description:
        "Fetches the full markdown content of a blog post by slug. Returns the raw markdown text.",
      parameters: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description:
              "The URL slug of the post (e.g., 'gardening', 'stackless-stacked-prs')",
            enum: posts.map((p) => p.slug),
          },
        },
        required: ["slug"],
      },
      handler: async (params) => {
        const slug = params?.slug as string;
        const response = await fetch(`/posts/${slug}.md`);
        if (!response.ok) {
          return { error: `Post not found: ${slug}` };
        }
        const content = await response.text();
        return { slug, content };
      },
    });

    navigator.modelContext.registerTool({
      name: "search_posts",
      description:
        "Search blog posts by keyword in title or excerpt. Returns matching posts.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Search term to match against post titles and excerpts",
          },
        },
        required: ["query"],
      },
      handler: (params) => {
        const query = (params?.query as string).toLowerCase();
        const results = posts.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.excerpt.toLowerCase().includes(query),
        );
        return {
          query,
          results: results.map((p) => ({
            title: p.title,
            slug: p.slug,
            date: p.date,
            url: `https://blog.eliperkins.com/${p.slug}`,
          })),
        };
      },
    });

    navigator.modelContext.registerTool({
      name: "get_blog_info",
      description:
        "Returns metadata about this blog including the author, topics, and how to access content",
      handler: () => ({
        name: "Eli Perkins's Blog",
        author: "Eli Perkins",
        url: "https://blog.eliperkins.com",
        description: "A bunch of ramblings from Eli Perkins",
        topics: [
          "Swift",
          "iOS",
          "Software Engineering",
          "Developer Tools",
          "Technical Leadership",
        ],
        feeds: {
          rss: "https://blog.eliperkins.com/rss.xml",
          markdown: "https://blog.eliperkins.com/index.md",
        },
        totalPosts: posts.length,
      }),
    });
  }, [posts]);

  return null;
};

export default WebMCP;
