import { Fragment } from "react";
import { RichText } from "@atproto/api";

import { checkUri } from "./checkUri";
import { app } from "../../lib/lexicons";
import { Avatar } from "./avatar";

const ThreadPost = ({
  threadPost,
  className,
}: {
  readonly threadPost: app.bsky.feed.defs.ThreadViewPost;
  readonly className?: string;
}) => {
  const record = app.bsky.feed.post.$validate(threadPost.post.record);
  const richText = new RichText({
    text: record.text,
    facets: record.facets,
  });
  richText.detectFacetsWithoutResolution();

  return (
    <div
      className={
        "font-mono text-sm max-w-prose" + (className ? " " + className : "")
      }
    >
      <div className="flex items-center gap-2 pb-1" key={threadPost.post.cid}>
        {threadPost.post.author.avatar != null && (
          <Avatar
            alt={threadPost.post.author.handle}
            href={`https://bsky.app/profile/${threadPost.post.author.handle}`}
            imageURL={threadPost.post.author.avatar}
          />
        )}
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <a
              className="dark:text-gray-300 hover:underline underline-offset-2 font-medium tracking-tight"
              href={`https://bsky.app/profile/${threadPost.post.author.handle}`}
            >
              {threadPost.post.author.displayName}
            </a>
            <span className="text-xs text-gray-400">
              {" • "}
              <a
                className="hover:underline underline-offset-2"
                href={checkUri(threadPost.post.uri)?.link}
              >
                <time dateTime={threadPost.post.indexedAt}>
                  {new Intl.DateTimeFormat("en-US").format(
                    new Date(threadPost.post.indexedAt),
                  )}
                </time>
              </a>
            </span>
          </div>
          <span className="text-xs text-gray-500">
            @{threadPost.post.author.handle}
          </span>
        </div>
      </div>

      <span className="prose prose-eli font-mono text-sm">{richText.text}</span>

      {threadPost.replies?.map((reply) => {
        const r = app.bsky.feed.defs.threadViewPost.$validate(reply);
        return (
          <Fragment key={r.post.cid}>
            <div className="w-px h-4 mx-3 mt-1 bg-gray-400" />
            <ThreadPost threadPost={r} />
          </Fragment>
        );
      })}
    </div>
  );
};

export default ThreadPost;
