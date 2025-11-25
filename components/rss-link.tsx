import Link from "next/link";
import { RssIcon } from "@primer/octicons-react";

interface RSSLinkProps {
  readonly size: "small" | "large";
}

const RSSLink = ({ size }: RSSLinkProps) => {
  if (size === "small") {
    return (
      <Link
        className="border border-gray-300 px-2 py-1 rounded-sm hover:text-gray-800 hover:shadow-xs hover:border-gray-300"
        href="/rss.xml"
      >
        <RssIcon className="mr-1 inline" />
        RSS
      </Link>
    );
  } else {
    return (
      <Link
        className="transition-all flex h-10 group border border-gray-200 px-3 py-2 rounded-sm text-gray-400 hover:text-gray-800 hover:shadow-xs hover:border-gray-300 mb-4"
        href="/rss.xml"
      >
        <RssIcon className="transition-all group-hover:mr-1" size={20} />
        <div className="transition-all transform sr-only group-hover:not-sr-only translate-x-1/4 group-hover:translate-x-0 overflow-hidden line-clamp-1 opacity-0 group-hover:opacity-100">
          RSS Feed
        </div>
      </Link>
    );
  }
};

export default RSSLink;
