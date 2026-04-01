import { format } from "date-fns";
import Link from "next/link";
import Script from "next/script";
import Bio from "@/components/bio";
import Comments from "@/components/comments";
import { makeGraphForPost } from "@/lib/jsonld";
import { JsonLd } from "@/components/jsonld";
import BlogPostConversation from "@/components/bsky/blog-post-conversation";
import { fetchPost, fetchPostContent, fetchPosts } from "@/lib/posts";

import type { Metadata } from "next";

import "../syntax-highlighting.css";

interface Props {
  readonly params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const postSlugs = await fetchPosts();
  return postSlugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await fetchPost(slug);

  return {
    title: `${post.title} · Blog · Eli Perkins`,
    alternates: {
      types: {
        "text/markdown": `/posts/${slug}.md`,
      },
      canonical: `/${slug}`,
    },
    openGraph: {
      title: `${post.title} · Blog · Eli Perkins`,
      description: post.unprocessedExcerpt,
      url: post.slug,
      siteName: "Blog - Eli Perkins",
      type: "article",
      publishedTime: post.date.toUTCString(),
    },
  };
}

const BlogPostHeader = () => (
  <h3 className="mb-12">
    <Link
      className="text-2xl lg:text-3xl font-medium underline decoration-amber-600 decoration-1 underline-offset-4 hover:text-amber-700 tracking-tight dark:text-gray-400"
      href="/"
    >
      Eli Perkins.
    </Link>
  </h3>
);

const BlogPost = async ({ params }: Props) => {
  const slug = (await params).slug;
  const post = await fetchPost(slug);
  const content = await fetchPostContent(slug);
  const jsonLd = makeGraphForPost(post);

  return (
    <main>
      <JsonLd object={jsonLd} />
      <Script src="https://platform.twitter.com/widgets.js" />
      <BlogPostHeader />
      <time
        className="text-sm lg:text-base text-gray-500 dark:text-gray-500"
        dateTime={post.date.toISOString()}
      >
        {format(post.date, "MMMM dd, yyyy")}
      </time>
      <h1 className="mt-1 mb-4 text-4xl tracking-[-.035em] dark:text-gray-100">
        {post.title}
      </h1>
      {
        <article
          className="prose prose-eli"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: content }}
        />
      }
      <hr className="border-gray-200 md:-mr-4 lg:-mr-14 mt-8" />
      <Bio />
      {post.bsky ? <BlogPostConversation bskyPost={post.bsky} /> : null}
      <Comments />
    </main>
  );
};

export default BlogPost;
