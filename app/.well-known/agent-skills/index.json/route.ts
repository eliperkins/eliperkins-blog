import { fetchPosts } from "@/lib/posts";

export const dynamic = "force-static";

export async function GET() {
  const posts = await fetchPosts();
  const slugs = posts.map((p) => p.slug).join(", ");

  const skills = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: "list-posts",
        type: "skill-md",
        description:
          "List all blog posts by Eli Perkins with titles, dates, and excerpts",
        url: "https://blog.eliperkins.com/index.md",
      },
      {
        name: "get-post",
        type: "skill-md",
        description: `Retrieve the full markdown content of a blog post. Available post slugs: ${slugs}`,
        url: "https://blog.eliperkins.com/posts/{slug}.md",
      },
      {
        name: "get-rss-feed",
        type: "skill-md",
        description:
          "Get the RSS feed of all blog posts with full content",
        url: "https://blog.eliperkins.com/rss.xml",
      },
    ],
  };

  return new Response(JSON.stringify(skills, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}
