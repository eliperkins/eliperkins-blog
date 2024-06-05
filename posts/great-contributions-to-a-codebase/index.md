---
title: What makes a great contribution to a codebase?
date: 2024-06-05T00:00:00
excerpt: Guidelines and principles learned in going from two to seven ICs.
---

Some years ago, my team at GitHub grew from 2 full time individual iOS contributors (and one [manager who could still code](https://github.com/rnystrom)), to 7 of us ICs. Growing a team by 3.5x meant that certain behaviors, concepts or principles that were easy enough to agree upon with just two folks now needed to scale up to many independent people.

I wrote up this document for our repo's `CONTRIBUTING.md` to try to capture our growing team's guiding light in what made a great pull request or the building blocks of a great feature. A good chunk of it still holds true today. Here's `github/mobile-ios`'s guidelines for great contributions.

---

## Development Principles

### Testing

#### Leverage unit tests to prevent bugs, regressions

Caught a bug and found a way to fix it? Great, you're halfway there!

One way to prevent a bug from recurring is to write a unit test around the bug. Writing a failing test that isolates the bug and refactoring using ["red, green, refactor"](https://www.codecademy.com/articles/tdd-red-green-refactor) will not only fix the bug but give the codebase a way to ensure other changes don't break it again in the future.

#### Prefer unit tests before snapshot tests

Prefer unit testing behaviors on view models to assert behaviors. View models allow for testing at a more granular level without involving UIKit.

#### Prefer snapshot testing an individual view before snapshot testing a view controller

If a snapshot test is a useful way to test a behavior (e.g., asserting correct rendering of view in light mode and dark mode), prefer testing an individual view in isolation, rather than testing the whole view controller.

#### Snapshot tests as a tool in the toolbox, not a hammer for all tests

Remember, snapshot tests are only one tool that you can use to write tests. Before jumping to writing a snapshot test, ask yourself what behavior is trying to be tested. What assertions can be run on the view model before we test the view layer? What assertions can we run on an instance of a view controller, rather than rendering the view controller in its entirety.

All snapshot tests will involve UIKit as part of the system under test, meaning changes to UIKit will affect the test itself. We've seen snapshot tests be invalidated between iOS versions, Xcode versions, operating systems and more, so ensure that these variables are acceptable to the test you're writing.

### "Core before more"

#### Prefer well-tested features over rushed corner-cutting solutions

Got that new mockup in Figma that you're ready to crank on? Great! Take a moment to think about how to best land it into the codebase and what tests you might write as a part of your PR.

If you feel like landing a particular feature might take twice as long to do properly, that's totally okay! Let your team know, talk to your engineering manager about it, and ensure that writing tests is part of estimates on your project.

#### Use `TODO`s and linked issues to track follow-ups

#### Leverage feature flags to roll features out while still landing code into `main`

One great way to move at a higher velocity while still writing well-tested code is to leverage feature flags to hide your feature in production until it's ready for prime time.

Feature flags can also help you deploy features to certain environments or "rings", like only to TestFlight or only staff users. Use this to get feedback from a specific group of folks, rather than rushing out to production.

#### Refactor existing code in-place

Rather than rewriting code anew, prefer refactoring existing code in-place with a series of changes.

If it's tough to refactor a certain pattern in-place, try using a feature flag to allow for toggling between the new and old code.

#### Prefer consistency in patterns, code style

Follow established patterns within the codebase by default.

Have a new pattern that feels like it'd work out well? Great! Put the pull request up and start a discussion with your teammates.

**_Need_** a new pattern to accomplish a task within the codebase? First, ask yourself if there's a way to do this without a new pattern first. If not, cool! Put the PR up and discuss it with your teammates.

### Small atomic pull requests

Prefer pull requests that accomplish a single, focused change. Consider how easily your pull request could be reverted if needed.

#### Use stacked pull requests to break down a large diff or set of features/functionality

To keep code review as focused as possible, break up your large pull request into a series of pull requests.

Instead of one PR like:

- **Add XYZ feature**<br /><span class="font-mono text-sm"><span class="text-green-700">+1,029</span>/<span class="text-red-700">-1,390</span></span> merging <span class="font-mono text-sm bg-sky-50 text-sky-800 border px-1 rounded-md">ep/add-xyz-feature</span> into <span class="font-mono text-sm bg-sky-50 text-sky-800 border px-1 rounded-md">main</span>

Prefer breaking up the PR into a series of pull requests like:

1. **[1/3] Add GraphQL module for XYZ**<br /><span class="font-mono text-sm"><span class="text-green-700">+400</span>/<span class="text-red-700">-90</span></span> merging <span class="font-mono text-sm bg-sky-50 text-sky-800 border px-1 rounded-md">ep/add-xyz-graphql</span> into <span class="font-mono text-sm bg-sky-50 text-sky-800 border px-1 rounded-md">main</span>
2. **[2/3] Create XYZ view controller**<br /><span class="font-mono text-sm"><span class="text-green-700">+215</span>/<span class="text-red-700">-33</span></span> merging <span class="font-mono text-sm bg-sky-50 text-sky-800 border px-1 rounded-md">ep/create-xyz-viewcontroller</span> into <span class="font-mono text-sm bg-sky-50 text-sky-800 border px-1 rounded-md">ep/add-xyz-graphql</span>
3. **[3/3] Use custom XYZ control throughout the app**<br /><span class="font-mono text-sm"><span class="text-green-700">+325</span>/<span class="text-red-700">-333</span></span> merging <span class="font-mono text-sm bg-sky-50 text-sky-800 border px-1 rounded-md">ep/custom-xyz-control</span> into <span class="font-mono text-sm bg-sky-50 text-sky-800 border px-1 rounded-md">ep/create-xyz-viewcontroller</span>

This will create three discrete pull requests for your teammates to focus on, allowing for a better review of the code you wrote and for better code to be landed in piecemeal.

Further reading:

- [`git-pile`](https://github.com/keith/git-pile)
- ["Stacked pull requests: make code reviews faster, easier, and more effective"](https://www.michaelagreiler.com/stacked-pull-requests/)

### Code Review

#### Feel free to review pull requests from other projects

Leverage code review as a place to ask how another feature is being built. Dig deeper into a feature to learn about it's architecture or the product itself.

Keep in mind that informed decisions may have been made by other folks on the team, so ask questions and get curious!

#### Ask for tests during code review

Do you see some code that might have complex behavior that isn't obvious or is potentially brittle? **Asking the author for some tests is okay!** Tests are not just for the author but also for Future Us™ as we change the code around it.

Code review is a great time to ask how certain parts of a pull request could be tested. Tests can also provide clarification on certain behaviors, allowing for complex states to be modeled and asserted against.

## Submitting Pull Requests

### Leverage pull request templates

Add further description about what the change that is being made does. Clarify questions that you think reviewers might have. Add steps on how to test the change out locally. Indicate if a change might be risky or requires other changes as well.

Pull requests currently have a template to help you answer some of these questions while also providing a consistent format for reviewers to learn more about the change you're proposing.

### Git commit style

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Try to limit the first line to 80 characters or less.
- Focus on "why" within the body/message of the commit. Let your code focus on "what" changed.
  - e.g., "This refactor allows the app to send a query that works on all GitHub Enterprise instances" not "This changes the query by adding the `foo` field and removing the `bar` field"
- Reference issues and pull requests liberally after the first line.
  - Use phrases like `Closes #1039` to automate closing issues when your pull request is merged.
- Avoid writing commits like `Fix bug`, preferring more description
  - Remember that the git commit log will be helpful to Future Us™ and Future You™ too! Running `git blame` on code is a great way to get context as to why code is written a certain way.

## ADRs

ADRs (or architecture decision records) are a great way to capture a snapshot of what decisions led to a certain architecture within the codebase.

Have a question about how different parts of the codebase work together? Curious as to how a certain module is architected? Check out the ADRs for it!

Writing a new module with a bunch of surface area? Have a proposal for a new architecture or pattern to follow? Write an ADR for it!

Our ADRs are stored within this repo at `docs/adrs`, but you can also find more ADRs within `github/mobile` for ADRs that affect both iOS and Android.

Further reading:

- [GitHub Blog: "Why Write ADRs"](https://github.blog/2020-08-13-why-write-adrs/)

## Project Planning

### Estimate time needed to write testable code as part of project planning

Even if the smallest possible change to accomplish your feature could be made within a day, ensure that you're also accounting for the time it takes to test the feature. "Testable code" could mean writing unit tests, refactoring to allow for writing tests, or spinning up a development environment to test the feature itself.

It's okay (and encouraged!) to advocate as much time as needed to write and test a new feature. Work with your team to ensure that estimates match what all folks on the team expect.

### Break down epics into smaller milestones to ship more often

Talk with your team about sequencing a series of changes that ship to production rather than bundling a ton of code behind a single feature flag.

By shipping incrementally, we can gain more feedback and iterate towards correctness. This will let you focus on smaller diffs and changes as well!

## Submitting Bug Reports

Bugs are tracked as GitHub issues. When you've come across a bug within GitHub for iOS, create an issue in `github/mobile-ios` and provide the following information by filling in the "Bug Report" template.

Explain the problem and include additional details to help us reproduce the problem:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible. For example, start by explaining how you opened the app and navigated to that screen, where you tapped, how you were able to get into a fixed or different state.
- **Provide specific examples to demonstrate the steps**. Include links to relevant content on GitHub.com to help us reproduce or navigate back to that screen within the app.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.
- **If you're reporting that GitHub for iOS crashed**, include your device info (what model iPhone/iPad? cellular or wifi?), operating system information, and version and build of the app that you're using (you can find this in the footer of Settings within the app).
- **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.
