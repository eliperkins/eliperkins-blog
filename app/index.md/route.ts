import { fetchPosts } from "@/lib/posts";
import { format } from "date-fns";

export const dynamic = "force-static";

export async function GET() {
  const posts = await fetchPosts();

  const lines: string[] = [];

  lines.push("# Eli Perkins's Blog", "");
  lines.push("A bunch of ramblings from Eli Perkins.", "");
  lines.push("## Posts", "");

  for (const post of posts) {
    const dateStr = format(post.date, "yyyy-MM-dd");
    lines.push(
      `### [${post.title}](https://blog.eliperkins.com/${post.slug})`,
    );
    lines.push(`*${dateStr}* · ${String(post.readingTime)} min read`, "");
    if (post.unprocessedExcerpt) {
      lines.push(post.unprocessedExcerpt, "");
    }
  }

  lines.push("---", "");
  lines.push(
    "- Website: https://eliperkins.com",
    "- Blog: https://blog.eliperkins.com",
    "- RSS: https://blog.eliperkins.com/rss.xml",
    "- GitHub: https://github.com/eliperkins",
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
