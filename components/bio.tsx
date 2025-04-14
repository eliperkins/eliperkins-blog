import Image from "next/image";
import Link from "next/link";

import profilePic from "./headshot.jpg";

function Bio() {
  return (
    <div className="flex items-center mt-4">
      <Image
        src={profilePic}
        alt="Eli Perkins"
        className="w-16 h-16 rounded-full mr-2"
      />
      <p>
        Written by{" "}
        <Link
          href="https://eliperkins.com"
          className="font-semibold underline underline-offset-2"
        >
          Eli Perkins
        </Link>
        , an engineering leader based in Denver.{" "}
        <a
          className="underline underline-offset-2 text-amber-600 font-semibold hover:text-amber-700"
          href="https://bsky.app/profile/eliperkins.com"
        >
          Say hello on Bluesky.
        </a>
      </p>
    </div>
  );
}

export default Bio;
