---
title: Writing Great Release Notes Doesn't Need to Be Hard
date: 2024-08-23
excerpt: Passing on the opportunity to engage with your customers means giving up on showing your biggest fans that you're putting work into polishing and improving your app.
---

Communicating with your app's customers is an art. Large companies and lazy businesses choose the lazy way out, writing the infamous "Bug fixes and performance improvements" week after week for their app's release notes. **Writing great release notes doesn't need to be hard**. Passing on the opportunity to engage with your customers means giving up on showing your biggest fans that you're putting work into polishing and improving your app.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Companies don’t care about release-notes.<br><br>And Apple isn’t setting a great example 😂 <a href="https://t.co/hQ6ngAPM7a">pic.twitter.com/hQ6ngAPM7a</a></p>&mdash; Jelle Prins (@jelleprins) <a href="https://twitter.com/jelleprins/status/1746441317452759477?ref_src=twsrc%5Etfw">January 14, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

When [GitHub Mobile](https://github.com/mobile) began to scale from monthly releases to biweekly releases to now weekly releases, we needed to empower our release captains with the ability to write release notes that were not only on-brand, but informative and consistent. I worked with [Brian Lovin](https://brianlovin.com) and the team to put together a set of guidelines to write release notes that focused on the customer, rather than on the company or bragging about the app itself. Every release, that week's release captain would get a list of the changes going into the app, drafted up a set of release notes, and had them approved not by copywriters, but by the team itself, empowering individual contributors, engineering managers, product managers and designers to speak with the same voice.

> [!NOTE/Note]
> Brian Lovin is one of the greatest at pitching products that I've ever worked with. Checkout [Campsite's Changelog](https://www.campsite.co/changelog) or [how he builds in public on his social media](https://x.com/brian_lovin) 🏕️.
>
> Much of what's in this document is from his mentorship and guidance!

These are the guidelines we put together for writing great release notes for GitHub Mobile. We hope you can use them to delight your app's superfans with your next release.

---

Every week we ship new software to our users. The way we talk about our changes matters: release notes build excitement for our new features, inform people about what's fixed or improved, and remind people that our apps are constantly getting better with bug fixes.

It's important for our release notes to communicate clearly and consistently. We want our release notes to have "one voice," be grammatically correct, be ordered by impact on the user, and when applicable, instruct the user what actions they should take next. Also, checkout GitHub's overall [Voice & tone guidelines](https://brand.github.com/brand-identity/voice-and-tone).

## Guidelines

### Naming & Capitalization

Follow [GitHub's Brand Content guidelines](https://brand.github.com/brand-identity/attributes) for naming and capitalizing features and products within release notes.

We reserve capitalization for the products and programs that define the GitHub experience and where it’s needed for clarity. We use consistent capitalization across marketing pages, docs, blog posts, and wherever else the name appears at launch and subsequently.

#### Rule of thumb

When first introduced, primary GitHub owned projects, products, and features are capitalized, like `GitHub Codespaces`. After that, you can drop the `GitHub` and simply refer to the feature by its name, `Codespaces`. When referring to the feature in the product, it’s sentence cased (e.g., `New codespace` for button text or `Codespaces` as a navigation link).

#### Lowercase

Use lowercase names for features and products that aren’t distinct to or ownable by GitHub.

**Examples**: insights, accounts, payments, integrations, pull requests, security alerts, search

#### Capitalized

Use capitalized names for features and products that are distinct to or ownable by GitHub.

**Examples**: Octocat, Pulse, Enterprise Server

Some features and products can introduce confusion into an experience if not capitalized:

**Examples**: GitHub Pages, GitHub Projects

Note: Use GitHub Projects on the first instance it is used in writing. After capitalize Projects when you are referring to the capability (feature) but this is not necessary if you are talking about it as a noun (i.e. You can share projects with your team.).

### Tone and tense

#### Avoid third-person when talking about GitHub or our team

Avoid using the word `we` in release notes. Instead, focus attention on the features and the benefits themselves.

```diff
- We made it easier to do foo.
+ A new widget makes it easier to do foo.
```

It is fine to address users using the personal `you`, as this still describes the benefit to the user: `Foo makes it easier to see the status of your bar.`

#### Avoid the word `now` when indicating when the change will affect the user

In most cases, this word can be dropped to better indicate the fix and plays nicely with the ["Make it concise"](#make-it-concise) principle of avoiding superfluous terms. If the user is reading the release notes about a given release, the timeframe is implicit based on installing the update.

Leverage the [imperative mood](https://en.wikipedia.org/wiki/Imperative_mood) followed by the [outcome for the user](#focus-on-outcomes-and-behavior-changes).

```diff
- Nested task lists now indent properly in issue comments.
+ Nested task lists indent properly in issue comments.
```

```diff
- You can now view threaded comments on pull requests.
+ View threaded comments on pull requests to see what others are saying.
```

```diff
- Your scroll-position in code views is now correctly maintained when rotating your device.
+ Rotate your device without losing your scroll position in code views.
```

### What's New

New features, or noticeable improvements to existing features, should always be in the `What's new` section of the release notes.

#### Focus on outcomes and behavior changes

Users want to know how changes or fixes affect their day to day lives. Does it make something easier? Is a new action possible? Is a flow faster? Rather than plainly describing a change, try to emphasize the outcome or benefits for a user.

```diff
- Support quote reply for discussions comments
+ Quote reply a comment in a discussion to keep the conversation going.
```

#### Write like a human

Write like a human. Explain what's new in a professional, but not stuffy way. We're talking to real people, and they expect honest and clear communication.

```diff
- Added profile tab to make it easier to navigate.
+ A new Profile tab makes it easier to get to your profile from anywhere in the app.
```

#### Use full sentences

Use complete thoughts to clearly communicate an idea or feature.

```diff
- Viewing repositories list on iPad shows split view
+ Viewing a list of repositories on iPad shows the list and repository details in a split view.
```

#### Milestone ships are "introduced"

For our milestone ships – like Discussions – we "introduce" the new functionality with a more excited announcement-like voice. In these cases, use a few sentences to describe the core functionality, and guide users to the place where they can try the new feature.

```diff
- Discussions are now supported. Create, edit, and delete discussions in repositories where Discussions are enabled.
+ Introducing Discussions, a new way to connect with your community, team, and collaborators on GitHub! Share new ideas, ask questions, and find inspiration within your repository.
```

#### Use an active voice

Use active verbs like "viewing" and "tapping" and "browsing" instead of their passive variants like "When foo is viewed" or "When foo is tapped".

```diff
- When a new issue is being created, there is now a loading spinner.
+ Creating a new issue shows a loading spinner.
```

### Bug Fixes

People may scan bug fixes to see if an issue they reported or experienced is now resolved. Because people are scanning this list, we must make our documentation concise and front load the fix in our copywriting.

#### Focus on outcomes and behavior changes

Users want to know how bug fixes actually affect them. Are they now unblocked? Is their specific use case now supported? Focusing on behaviors creates incentive for users to poke around and try things in the apps.

```diff
- Tapping on a notification no longer selects the wrong notification
+ Tapping on a notification selects the correct notification.
```

#### Make it concise

```diff
- We discovered that when people were navigating through the file tree, if they long-pressed on the back button, there would be cases that the app could crash. This is now fixed.
+ Fixed a crash that occurred when navigating files and long-pressing the back button.
```

#### Front load the fix

Quickly communicate the feature or surface where the bug fix occurred so that people can quickly decide if it's important to them.

```diff
- When there is expandable content, and when dark mode is enabled, user profile READMEs render correctly.
+ User profile READMEs with expandable content render correctly in light and dark mode.
```

#### Use active voice when possible

This isn't always possible for certain kinds of bug fixes, but when possible we should maintain an active voice when describing fixes.

```diff
- Fix nested task list indentation
+ Nested task lists indent properly in issue comments.
```

### What if we have a week with no user-facing changes?

Has the team been heads down on new features behind feature flags? Is the changelog full of only feature-flagged changes? **That's okay!**

Release notes are one of the few points of interactions that we have to communicate _directly_ with our customers. By using release notes like "Bug fixes and performance improvements," we've given away an opportunity to tell our customers what great features we've been hard at work on over previous weeks as well. Additionally, "Bug fixes and performance improvements" is an opaque phrase which doesn't indicate to our customers where those fixes can be found or what performance has been improved. Let's do better than this!

As release captain, if that week's release notes have no user-facing changes in release notes:

1. **Use the previous release's release notes.**
2. If last week's release notes include an "Introducing" change, **check in with that team to see how to best rephrase that line!**

This gives us a second chance to communicate the changes that our customers _will_ get in that build, as well as giving the previous week's release notes another week to get in front of our customers.

If a feature has been ["Introduced"](#milestone-ships-are-introduced), feel free to work with the epic team to adjust the copy such that "Introducing..." can be adjusted to the benefit of that feature. For example:

```diff
- "Introducing Actions! View workflow run details and manage your pull request checks on the go."
+ "View workflow run details and manage your pull request checks on the go with GitHub Actions."
```

To re-iterate, _it's okay_ to have weeks where we have no user-facing changes. When that happens, use the previous week's release notes for this week's release notes.
