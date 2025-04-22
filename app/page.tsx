import Bio from "@/components/bio";
import { fetchPosts } from "@/lib/posts";
import Link from "next/link";
import { format } from "date-fns";
import Script from "next/script";
import RSSLink from "@/components/rss-link";

const MainHeader = () => (
  <div className="flex justify-between w-full max-w-(--breakpoint-lg) items-center">
    <h1 className="text-5xl mb-4 font-bold">
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

const Home = async () => {
  const posts = await fetchPosts();

  return (
    <>
      <Script src="/sw.js" strategy="beforeInteractive" />
      <main>
        <MainHeader />
        <Bio />
        <ul className="prose md:prose-lg lg:prose-xl font-serif prose-a:font-semibold prose-a:underline-offset-4 prose-a:text-amber-600 prose-a:hover:text-amber-700 prose-h3:mb-0 prose-p:my-0">
          {posts.map((post) => (
            <li key={post.slug}>
              <h3>
                <Link href={post.slug}>{post.title}</Link>
              </h3>
              <time
                className="text-sm lg:text-base"
                dateTime={post.date.toISOString()}
              >
                {format(post.date, "MMMM dd, yyyy")}
              </time>
              {post.excerpt ? (
                // eslint-disable-next-line react/no-danger
                <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
              ) : null}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default Home;
