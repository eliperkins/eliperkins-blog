import Link from "next/link";
import { RssIcon } from "@primer/octicons-react";

type RSSLinkProps = {
  size: "small" | "large";
};

export default function RSSLink(props: RSSLinkProps) {
  if (props.size === "small") {
    return (
      <Link
        href="/rss.xml"
        className="border px-2 py-1 rounded hover:text-gray-800 hover:shadow-sm hover:border-gray-300"
      >
        <RssIcon className="mr-1" />
        RSS
      </Link>
    );
  } else {
    return (
      <Link
        href="/rss.xml"
        className="transition-all flex h-10 group border px-3 py-2 rounded text-gray-400 hover:text-gray-800 hover:shadow-sm hover:border-gray-300 mb-4"
      >
        <RssIcon
          size={20}
          className="transition-all -mr-[72px] group-hover:mr-1"
        />
        <div className="font-semibold group-hover:block transition-all overflow-hidden line-clamp-1 opacity-0 group-hover:opacity-100">
          RSS Feed
        </div>
      </Link>
    );
  }
}
