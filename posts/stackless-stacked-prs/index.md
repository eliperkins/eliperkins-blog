---
title: Stackless Stacked Pull Requests
date: 2024-10-24
excerpt: |
  How I've made my workflow more efficient with `git-pile` and gotten feedback on my work faster and easier.
---

No one likes to review a <span class="font-mono text-sm"><span class="text-green-700">+4,490</span>/<span class="text-red-700">-903</span></span> pull request. It's far too much code for one reviewer to hold in their head, and results in worse feedback and slower review times. However, sometimes a large swath of code needs to be changed to close out an issue or to ship a new feature.

One of my favorite Kent Beck-isms is "[Make the change easy, then make the easy change](https://x.com/KentBeck/status/250733358307500032)."

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">for each desired change, make the change easy (warning: this may be hard), then make the easy change</p>&mdash; Kent Beck 🌻 (@KentBeck) <a href="https://twitter.com/KentBeck/status/250733358307500032?ref_src=twsrc%5Etfw">September 25, 2012</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I'm sure my team is tired of hearing me say it, but it's a great way to break down changes into smaller chunks that are easier to reason about and review. [Martin Fowler calls this "prepartory refactoring"](https://martinfowler.com/articles/preparatory-refactoring-example.html), where changes are made in preparation for the larger change, making it trivial to make the final change.

One way to do this is to use a technique called "stacked pull requests."

[Stacked pull requests is something I've talked about before](/great-contributions-to-a-codebase#use-stacked-pull-requests-to-break-down-a-large-diff-or-set-of-featuresfunctionality) as part of my "Great Contributions to a Codebase" post. The idea is to break down on monolithic pull request into smaller chunks, each on a separate branch, and where each PR points at the branch ahead of it. Each of these PRs can be reviewed independently, and then merged from the first PR to the last, rebasing along the way as each PR is merged. This daisy-chaining of PRs ([as my colleague, Sarah Vessels, calls it][pro-tips]) is a pattern of organizing branches where PRs for each piece of functionality make the change easy and then make the easy change.

However, this still involves some human overhead, along with the additional `git rebase` needed to keep merge history clean as each PR is merged. While it's not a ton of work, compounding with CI time, it can make it tough to keep stacked PRs up-to-date. There's tools that have come out like [Graphite's Stacked PRs][stacked-prs] and [Modular's Stack PR tool][modular-stack-pr] that help automate this process, but I've found a simpler way to manage stacked PRs that doesn't require any additional tooling.

Earlier this year, I started using [`git-pile`][git-pile] by Keith Smiley and Dave Lee, which is a Facebook-/Phabricator-influence way of creating stacked PRs. In this approach, instead of creating a branch for each commit and for each PR, as a developer, I commit directly to `main` on my local working copy, and use `git submitpr` to have `git-pile` take that commit and create a PR for it. Under the hood, `git-pile` uses a separate git worktree of my repo, creating a new branch for each invocation of `git submitpr`, and then pushing that branch to GitHub to create a PR. My main working copy is always in a state I can anticipate, and without the need for an additional set of metadata from a service like Graphite or to daisy-chain PR after PR to keep developing locally.

This involves a bit of a change in my mental model of how I work with git and my codebase. Instead of having a feature-branch-ish approach with daisy-chained stacked PRs, where my functionality lives in a set of `n` branches, all which depend on each other, instead, I anticipate that my `main` branch in my local working copy will _eventually_ be the same as what's on `origin/main`, after responding to feedback from PR review and working with my teammates. However, **I'm never blocked from merging my stacked PRs into `main`** because my local `main` is already up-to-date! No rebasing needed, other than `git pull`-ing changes from `origin/main` to my local `main`.

This has also changed how I stack my pull requests too. I've found ways to break down my PRs into idempotent pieces, rather than daisy-chained ones, where I can set myself up by making the change easy, and then finally making the easy change once the other PRs have been merged.

Let's look at a contrived example. Say I'm working on a feature that requires:

1. Changing legacy code to add a new `isFeatureXYZEnabled` property
2. Creating a new controller that's used when `isFeatureXYZEnabled == true`
3. Changing the behavior within the legacy code to use the new controller if the feature is enabled

In a stacked PR model, I'd have three PRs, each dependent on the one before it. So something like:

1. **[1/3] Add a new `isFeatureXYZEnabled` property**<br /><span class="font-mono text-sm"><span class="text-green-700">+400</span>/<span class="text-red-700">-90</span></span> merging <span class="font-mono text-sm bg-sky-50 text-sky-800 border border-sky-800/24 px-1 rounded-md">ep/add-xyz-feature</span> into <span class="font-mono text-sm bg-sky-50 text-sky-800 border border-sky-800/24 px-1 rounded-md">main</span> • 1 commit
2. **[2/3] Add `ModernXYZController` for the new feature**<br /><span class="font-mono text-sm"><span class="text-green-700">+215</span>/<span class="text-red-700">-33</span></span> merging <span class="font-mono text-sm bg-sky-50 text-sky-800 border border-sky-800/24 px-1 rounded-md">ep/add-modern-xyzcontroller</span> into <span class="font-mono text-sm bg-sky-50 text-sky-800 border border-sky-800/24 px-1 rounded-md">ep/add-xyz-feature</span> • 1 commit
3. **[3/3] Use `ModernXYZController` if enabled**<br /><span class="font-mono text-sm"><span class="text-green-700">+10</span>/<span class="text-red-700">-30</span></span> merging <span class="font-mono text-sm bg-sky-50 text-sky-800 border border-sky-800/24 px-1 rounded-md">ep/enable-xyz</span> into <span class="font-mono text-sm bg-sky-50 text-sky-800 border border-sky-800/24 px-1 rounded-md">ep/add-modern-xyzcontroller</span> • 1 commit

![git branches showing the daisy-chained pull requests visually](/images/daisy-chained-prs.png)

However, with a "stackless" stacked PR model with `git-pile`, I can break this down into two PRs that are idempotent where PR #1 and #2 can be merged in any order ([or even simulatenously with a merge queue](https://github.blog/news-insights/product-news/github-merge-queue-is-generally-available/)), and where the third PR can either be stacked on the first two, or wait until I've gotten feedback on the first two and have them merged into `main`. So something like:

1. **Add a new `isFeatureXYZEnabled` property**<br /><span class="font-mono text-sm"><span class="text-green-700">+400</span>/<span class="text-red-700">-90</span></span> merging <span class="font-mono text-sm bg-sky-50 text-sky-800 border border-sky-800/24 px-1 rounded-md">ep/add-xyz-feature</span> into <span class="font-mono text-sm bg-sky-50 text-sky-800 border border-sky-800/24 px-1 rounded-md">main</span> • 1 commit
2. **Add `ModernXYZController` for the new feature**<br /><span class="font-mono text-sm"><span class="text-green-700">+215</span>/<span class="text-red-700">-33</span></span> merging <span class="font-mono text-sm bg-sky-50 text-sky-800 border border-sky-800/24 px-1 rounded-md">ep/add-modern-xyzcontroller</span> into <span class="font-mono text-sm bg-sky-50 text-sky-800 border border-sky-800/24 px-1 rounded-md">main</span> • 1 commit
3. **[Draft] Use `ModernXYZController` if enabled**<br /><span class="font-mono text-sm"><span class="text-green-700">+625</span>/<span class="text-red-700">-123</span></span> merging <span class="font-mono text-sm bg-sky-50 text-sky-800 border border-sky-800/24 px-1 rounded-md">ep/enable-xyz</span> into <span class="font-mono text-sm bg-sky-50 text-sky-800 border border-sky-800/24 px-1 rounded-md">main</span> • 3 commits

![git branches showing the stackless stacked pull requests visually](/images/stackless-stacked-prs.png)

This has sped up my personal development loop a ton, where I can _assume_ that PRs #1 and #2 will get feedback from my team and get merged into `origin/main` at any point, _just like I already have in my local working copy of `main`_! No more branch-of-a-branch-of-a-branch while I get feedback from my team, or needing to rebase daisy-chained PRs. Yes, there are totally times when stacked PRs are needed, and `git-pile` even supports that flow with the `--onto` flag, however, this change in my workflow has led me personally to making the change easy first, and then making the easy change. So after merging my PRs in upstream, upstream looks very similar to my local `main` branch:

![git branches showing the end result after merging with linear history](/images/after-merge.png)

There's so much more that `git-pile` does, and I feel like I've only personally become comfortable with a portion of it yet. However, this notion of stackless stacked PRs is something that can be adopted even without `git-pile` (even though it does make it _so_ much easier).

Strive to make Kent Beck happy: make the change easy, then make the easy change. And do it with small, reviewable PRs. 🚀

[git-pile]: https://github.com/keith/git-pile
[stacked-prs]: https://graphite.dev/blog/stacked-prs
[pro-tips]: https://github.blog/developer-skills/github/github-protips-tips-tricks-hacks-and-secrets-from-sarah-vessels/
[modular-stack-pr]: https://www.modular.com/blog/announcing-stack-pr-an-open-source-tool-for-managing-stacked-prs-on-github
