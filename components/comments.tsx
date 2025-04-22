"use client";

import Giscus from "@giscus/react";

const Comments = () => {
  return (
    <div className="max-w-4xl">
      <Giscus
        category="General"
        categoryId="DIC_kwDOBsQhrs4Cf6sK"
        emitMetadata="0"
        inputPosition="top"
        lang="en"
        loading="lazy"
        mapping="title"
        reactionsEnabled="1"
        repo="eliperkins/eliperkins-blog"
        repoId="MDEwOlJlcG9zaXRvcnkxMTM1MTY5NzQ="
        strict="0"
        theme="light"
      />
    </div>
  );
}

export default Comments;
