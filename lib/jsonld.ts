import type { BlogPosting, Person, Graph, WithContext } from "schema-dts";
import type { Post } from "@/lib/posts";

export const author: Person = {
  "@type": "Person",
  "@id": "https://eliperkins.com/#person",
  name: "Eli Perkins",
  alternateName: "eliperkins",
  image: "https://blog.eliperkins.com/images/headshot.jpg",
  email: "eli.j.perkins@gmail.com",
  url: "https://eliperkins.com",
  sameAs: [
    "https://blog.eliperkins.com",
    "https://github.com/eliperkins",
    "https://www.linkedin.com/in/eliperkins/",
    "https://bsky.app/profile/eliperkins.com",
  ],
  knowsAbout: [
    "iOS development",
    "Swift",
    "Mobile app development",
    "Technical leadership",
    "Software engineering",
  ],
};

export const authorWithContext: WithContext<Person> = {
  "@context": "https://schema.org",
  ...author,
};

export const makePost = (post: Post): BlogPosting => ({
  "@type": "BlogPosting",
  "@id": `https://blog.eliperkins.com/${post.slug}`,
  mainEntityOfPage: `https://blog.eliperkins.com/${post.slug}`,
  headline: post.title,
  description: post.unprocessedExcerpt,
  wordCount: post.wordCount,
  datePublished: post.date.toISOString(),
  url: `https://blog.eliperkins.com/${post.slug}`,
  inLanguage: "en-US",
  author: {
    "@type": "Person",
    "@id": author["@id"],
  },
});

export const makeGraphForPost = (post: Post): Graph => ({
  "@context": "https://schema.org",
  "@graph": [makePost(post), author],
});

export default makeGraphForPost;
