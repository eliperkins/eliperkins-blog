import Image from 'next/image';
import Link from 'next/link';

import profilePic from './headshot.jpg';

function Bio() {
  return (
    <div className="flex items-center">
      <Image
        src={profilePic}
        alt="Eli Perkins"
        className="w-16 h-16 rounded-full mr-2"
      />
      <p>
        Written by{' '}
        <Link href="https://eliperkins.com" className="font-semibold underline underline-offset-2">
          Eli Perkins
        </Link>
        , a mobile engineer based in Denver.{' '}
        <a
          className="underline underline-offset-2 text-amber-600 font-semibold hover:text-amber-700"
          href="https://mastodon.online/@eliperkins"
        >
          Say hello on Mastodon.
        </a>
      </p>
    </div>
  );
}

export default Bio;
