import Bio from '@/components/bio';
import { fetchPosts } from '@/lib/posts';
import Link from 'next/link';
import { format } from 'date-fns';
import { useEffect } from 'react';

const MainHeader = () => (
  <h1 className="text-5xl mb-4 font-bold">
    <Link
      className="underline decoration-amber-600 decoration-2 underline-offset-8 hover:text-amber-700"
      href="/"
    >
      Eli Perkins.
    </Link>
  </h1>
);

const unregisterGatsbyWorker = () => {
  if (
    navigator &&
    navigator.serviceWorker &&
    navigator.serviceWorker.getRegistrations
  ) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
};

export default async function Home() {
  var posts = await fetchPosts();

  useEffect(() => {
    unregisterGatsbyWorker();
  }, []);

  return (
    <main>
      <MainHeader />
      <Bio />
      <ul className="prose md:prose-lg lg:prose-xl font-serif prose-a:font-semibold prose-a:underline-offset-4 prose-a:text-amber-600 hover:prose-a:text-amber-700 prose-h3:mb-0 prose-p:my-0">
        {posts.map((post) => (
          <li key={post.slug}>
            <h3>
              <Link href={post.slug}>{post.title}</Link>
            </h3>
            <time
              dateTime={post.date.toISOString()}
              className="text-sm lg:text-base"
            >
              {format(post.date, 'MMMM dd, yyyy')}
            </time>
            {post.excerpt && (
              <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
