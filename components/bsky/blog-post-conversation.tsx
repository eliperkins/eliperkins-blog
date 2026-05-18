"use client";

import { useEffect, useState } from "react";
import { isAtUriString, xrpc } from "@atproto/lex";

import { app } from "../../lib/lexicons";
import AvatarStack from "./avatar-stack";
import ThreadPost from "./thread-post";

const BSKY_DID = "did:plc:wm37qzgdjvwztq6loytrtpul";
const BSKY_HANDLE = "eliperkins.com";

const BlogPostConversation = ({
  blueskyPostID,
}: {
  readonly blueskyPostID: string;
}) => {
  const uri = `at://${BSKY_DID}/app.bsky.feed.post/${blueskyPostID}`;
  const href = `https://bsky.app/profile/${BSKY_HANDLE}/post/${blueskyPostID}`;

  const [postThread, setPostThread] =
    useState<app.bsky.feed.defs.ThreadViewPost | null>(null);
  const [likes, setLikes] = useState<app.bsky.feed.getLikes.Like[] | null>(
    null,
  );

  useEffect(() => {
    let ignore = false;

    const fetchPost = async () => {
      if (!isAtUriString(uri)) return;

      try {
        const postThread = await xrpc(
          "https://public.api.bsky.app",
          app.bsky.feed.getPostThread,
          {
            params: {
              uri,
            },
          },
        );

        const postDetails = await xrpc(
          "https://public.api.bsky.app",
          app.bsky.feed.getLikes,
          {
            params: {
              uri,
            },
          },
        );

        if (ignore) return;

        const validatedThread = app.bsky.feed.defs.threadViewPost.$validate(
          postThread.body.thread,
        );
        setPostThread(validatedThread);
        setLikes(postDetails.body.likes);
      } catch (e) {
        console.error(e);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchPost();

    return () => {
      ignore = true;
    };
  }, [uri]);

  if (!postThread || !likes) {
    return <p>Loading Bluesky conversation...</p>;
  }

  return (
    <>
      <div className="font-mono text-sm py-4 dark:text-gray-400 flex flex-col gap-y-2">
        <div className="flex items-center gap-2">
          <AvatarStack
            avatars={likes
              .map((like) => {
                if (!like.actor.avatar) return null;
                return {
                  href: `https://bsky.app/profile/${like.actor.handle}`,
                  imageURL: like.actor.avatar,
                  alt: `${like.actor.displayName ?? ""} <${like.actor.handle}>`,
                };
              })
              .filter((avatar) => avatar != null)}
          />
          {postThread.post.likeCount != null && postThread.post.likeCount > 0
            ? `${postThread.post.likeCount.toFixed()} likes, `
            : "No likes, "}
          {postThread.post.replyCount != null && postThread.post.replyCount > 0
            ? `${postThread.post.replyCount.toFixed()} replies `
            : " no replies "}
          on Bluesky 🦋
        </div>
        <a
          className="underline underline-offset-4 text-amber-600 hover:text-amber-700 hover:after:content-['_↗']"
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          Join the conversation
        </a>
      </div>
      {postThread.replies?.map((reply) => {
        const r = app.bsky.feed.defs.threadViewPost.$validate(reply);
        console.log({ r });
        return <ThreadPost className="mb-8" key={r.post.cid} threadPost={r} />;
      })}
    </>
  );
};

export default BlogPostConversation;
