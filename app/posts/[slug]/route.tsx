import { fetchPosts, fetchRawMarkdown } from "@/lib/posts";
import { NextRequest } from "next/server";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const postSlugs = await fetchPosts();
  return postSlugs.map(({ slug }) => ({ slug: `${slug}.md` }));
}

export async function GET(
  request: NextRequest,
  context: RouteContext<"/posts/[slug]">,
) {
  const { slug } = await context.params;
  const slugWithoutExtension = slug.replace(/\.md$/, "");
  const post = await fetchRawMarkdown(slugWithoutExtension);
  return new Response(post, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
