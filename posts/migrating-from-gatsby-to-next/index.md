---
title: Migrating from Gatsby to Next.js
date: 2024-05-24
excerpt: Sometimes paying off tech debt comes at the cost of a rewrite
---

Some years ago, I migrated both my personal site and my blog to [Gatsby](https://www.gatsbyjs.com). At the time, Gatsby was the new hotness, using GraphQL for data fetching and with, at the time, a rich ecosystem of developers and plugins. The site rendered out to some static JavaScript and HTML, and ran completely statically on S3 and Cloudfront. At the cost of a dollar a month, both were completely functional for what I wanted them to be: a home for me on the internet.

As most developers do, I let my blog languish, and only really updated my personal site on occasion, like when I got a new job.

Last summer (2023), I got married, and as is a developer's rite of passage, I built [my own wedding website](http://eliandgeorgia.com). I really wanted to learn [Next.js](https://nextjs.org), and play around with technologies that were absolutely overkill for a website that would be used for a single event. In the process, I learned what a joy Next.js is to use, along with how productive I can be with [Tailwind CSS](https://tailwindcss.com). While I've written JavaScript professionally before, it's been many years since I've written JavaScript in earnest, so it was refreshing to once again experience how great the tooling can be when your developer tools aren't a black box built by one company (looking at you, Apple).

Since then, I've been looking at my Dependabot warnings growing in my personal website and blog, and also feeling like their design was rotting nearly as fast as the code instead the repo was. So as a fun educational side project, and knowing what it'd take to create a new Next.js app from my experience with my wedding website, I took the plunge to rewrite both my personal site and blog in Next.js.

After a few days, I had tossed all the old Gatsby code out the window, and had a prettier, more modern, more performant personal site and blog that I feel proud of again. Instead of having a dated look and legacy code as my footprint on the internet, I had a site that I can easily update with a quick `git push`.

Here's what I learned:

- Tailwind slaps, and makes me feel like a designer. 🎨 I can bring the design ideas that I know from mobile development, and apply a loose design system to my sites with just some HTML class names.
- There's no need for GraphQL in a static site which doesn't fetch data from the internet.
- Bringing [my old blog content](https://github.com/eliperkins/eliperkins-blog/tree/df1f44435169efb1310f06e44ab5d72402458976/posts) over from Gatsby to Next.js meant [loading in and parsing Markdown files at build-time](https://github.com/eliperkins/eliperkins-blog/blob/df1f44435169efb1310f06e44ab5d72402458976/lib/posts.tsx).
  - I want to explore using MDX for Markdown in blog posts in the future.
- [Yarn PnP and zero-installs](https://yarnpkg.com/features/caching#zero-installs) are trivial to set up these days.
  - Do I need it for my personal site/blog? Definitely not.
- Next.js makes it easy to do code-splitting, SSR, and in general, create a modern performant site, without needing to think about the technical concepts. _I feel productive with it in a way that I don't feel with other tools_.
- Having a site with continuous deployments on Actions, that I can just commit and push to makes it easier to make quick updates to content without needing to remember what credentials I need or what incantation of AWS APIs or button clicks are needed.
- I can still write functioning JavaScript.

For the curious, here's the tech stack overall:

- Framework: [Next.js](https://nextjs.org) (with app directory)
- Styling: [Tailwind CSS](https://tailwindcss.com)
- Hosting: AWS [S3](https://aws.amazon.com/s3/) + [Cloudfront](https://aws.amazon.com/cloudfront/) + [Route 53](https://aws.amazon.com/route53/)
- CI/CD: [GitHub Actions](https://github.com/features/actions)
  - [`@static/discharge`](https://github.com/brandonweiss/discharge) for easy deployments (which I should contribute back to!)
- Markdown parsing: [Remark](https://remark.js.org)
- RSS: [`feed`](https://github.com/jpmonette/feed)
- Other: TypeScript, Yarn, Prettier, CodeQL + Dependabot

_Want to learn more? Reach out to Eli via [email](mailto://eli.j.perkins@gmail.com) or on [Mastodon](https://mastodon.online/@eliperkins)._