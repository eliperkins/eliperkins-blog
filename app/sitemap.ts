import type { MetadataRoute } from "next";
import { fetchPosts } from "@/lib/posts";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://blog.eliperkins.com";
  const posts = await fetchPosts();
  const postsMapEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...postsMapEntries,
  ];
}
