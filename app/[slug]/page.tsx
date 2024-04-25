import { format } from 'date-fns';
import Link from 'next/link';
import Script from 'next/script';
import Bio from '@/components/bio';

import type { Metadata } from 'next';
import { fetchPosts, fetchPostContent, fetchPost } from '@/lib/posts';

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
      description: 'A bunch of ramblings from Eli Perkins',
      url: 'https://blog.eliperkins.com',
      siteName: 'Blog - Eli Perkins',
      type: 'article',
      publishedTime: post.date,
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
      <time dateTime={post.date} className="text-sm lg:text-base">
        {format(post.date, 'MMMM dd, yyyy')}
      </time>
      <h1 className="mt-1 mb-4 text-4xl font-bold">{post.title}</h1>
      <article
        className="font-serif prose md:prose-lg lg:prose-xl prose-a:font-semibold prose-a:underline-offset-4 prose-a:text-amber-600 hover:prose-a:text-amber-700 prose-pre:bg-[#011627]"
        dangerouslySetInnerHTML={{ __html: content }}
      ></article>
      <hr className="my-4" />
      <Bio />
    </main>
  );
}