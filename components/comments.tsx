"use client";

import Giscus from "@giscus/react";

export default function Comments() {
  return (
    <div className="max-w-4xl">
      <Giscus
        repo="eliperkins/eliperkins-blog"
        repoId="MDEwOlJlcG9zaXRvcnkxMTM1MTY5NzQ="
        category="General"
        categoryId="DIC_kwDOBsQhrs4Cf6sK"
        mapping="title"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
