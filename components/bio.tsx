import Image from 'next/image';

import profilePic from './headshot.jpg';

function Bio() {
  return (
    <div className='flex items-center'>
      <Image
        src={profilePic}
        alt="Eli Perkins"
        className='w-16 h-16 rounded-full mr-2'
        style={{
          // marginRight: rhythm(1 / 2),
          // marginBottom: 0,
          // width: rhythm(2),
          // height: rhythm(2),
          // borderRadius: '50%'
        }}
      />
      <p>
        Written by <span className='font-semibold'>Eli Perkins</span>, a mobile
        engineer based in Denver.{' '}
        <a className='underline text-amber-600 font-semibold hover:text-amber-700' href="https://mastodon.online/@eliperkins">
          Say hello on Mastodon.
        </a>
      </p>
    </div>
  );
}


export default Bio;
