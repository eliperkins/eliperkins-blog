import fs from "fs";
import path from "path";
import Bio from "@/components/bio";
import WebMCP from "@/components/web-mcp";
import { fetchPosts } from "@/lib/posts";
import Link from "next/link";
import { format } from "date-fns";
import RSSLink from "@/components/rss-link";
import { JsonLd } from "@/components/jsonld";
import { authorWithContext } from "@/lib/jsonld";

const MainHeader = () => (
  <div className="flex justify-between w-full max-w-(--breakpoint-lg) items-center">
    <h1 className="text-5xl mb-4 tracking-[-.035em] dark:text-slate-300">
      <Link
        className="underline decoration-amber-600 decoration-2 underline-offset-8 hover:text-amber-700"
        href="/"
      >
        Eli Perkins.
      </Link>
    </h1>
    <RSSLink size="large" />
  </div>
);

const publicationUri = fs
  .readFileSync(
    path.join(process.cwd(), "public/.well-known/site.standard.publication"),
    "utf-8",
  )
  .trim();

const Home = async () => {
  const posts = await fetchPosts();
  const jsonLd = authorWithContext;
  const postSummaries = posts.map((p) => ({
    title: p.title,
    slug: p.slug,
    date: format(p.date, "yyyy-MM-dd"),
    excerpt: p.unprocessedExcerpt,
    readingTime: p.readingTime,
  }));

  return (
    <main>
      {/* eslint-disable-next-line react/no-invalid-html-attribute */}
      <link href={publicationUri} rel="site.standard.publication" />
      <MainHeader />
      <Bio />
      <JsonLd object={jsonLd} />
      <WebMCP posts={postSummaries} />
      <ul className="prose md:prose-lg lg:prose-xl font-serif prose-header:prose-a:font-semibold prose-a:underline-offset-4 prose-a:text-amber-600 prose-a:hover:text-amber-700 prose-h3:mb-0 prose-p:my-0">
        {posts.map((post) => (
          <li key={post.slug}>
            <h3 className="tracking-tight font-medium">
              <Link href={post.slug}>{post.title}</Link>
            </h3>
            <time
              className="text-md lg:text-base text-slate-400 dark:text-gray-600"
              dateTime={post.date.toISOString()}
            >
              {format(post.date, "MMMM dd, yyyy")}
            </time>
            {post.excerpt ? (
              <div
                className="font-mono text-[16px] text-gray-500 dark:prose-code:text-gray-300 "
                dangerouslySetInnerHTML={{ __html: post.excerpt }} // eslint-disable-line react/no-danger
              />
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Home;
