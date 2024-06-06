import { format } from "date-fns";
import Link from "next/link";
import Script from "next/script";
import Bio from "@/components/bio";
import Comments from "@/components/comments";

import type { Metadata } from "next";
import { fetchPosts, fetchPostContent, fetchPost } from "@/lib/posts";

import "../highlightjs-nightowl.css";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const postSlugs = await fetchPosts();
  return postSlugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPost(params.slug);

  return {
    title: `${post.title} · Blog · Eli Perkins`,
    openGraph: {
      title: `${post.title} · Blog · Eli Perkins`,
      description: post.unprocessedExcerpt,
      url: post.slug,
      siteName: "Blog - Eli Perkins",
      type: "article",
      publishedTime: post.date.toUTCString(),
      images: [`${post.slug}/image.png`],
    },
  };
}

const BlogPostHeader = () => (
  <h3 className="mb-12">
    <Link
      className="text-2xl lg:text-3xl font-semibold underline decoration-amber-600 decoration-1 underline-offset-4 hover:text-amber-700"
      href="/"
    >
      Eli Perkins.
    </Link>
  </h3>
);

export default async function BlogPost({ params }: Props) {
  const post = await fetchPost(params.slug);
  const content = await fetchPostContent(params.slug);

  return (
    <main className="">
      <Script src="https://platform.twitter.com/widgets.js" />
      <BlogPostHeader />
      <time dateTime={post.date.toISOString()} className="text-sm lg:text-base">
        {format(post.date, "MMMM dd, yyyy")}
      </time>
      <h1 className="mt-1 mb-4 text-4xl font-bold">{post.title}</h1>
      <article
        className={`font-serif prose md:prose-lg
        lg:prose-xl prose-a:font-semibold prose-a:underline-offset-4
        prose-a:text-amber-600 hover:prose-a:text-amber-700
        prose-pre:bg-[#011627]
        prose-a:prose-headings:no-underline
        prose-a:prose-headings:text-gray-950
        hover:prose-a:prose-headings:text-gray-950`}
        dangerouslySetInnerHTML={{ __html: content }}
      ></article>
      <hr className="mt-8 mb-6" />
      <Bio />
      <Comments />
    </main>
  );
}
