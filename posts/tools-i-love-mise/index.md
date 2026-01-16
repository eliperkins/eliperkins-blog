---
title: "Tools I Love: mise (mise-en-place)"
date: 2026-01-15
excerpt: Use different versions of different languages and their toolchains with ease.
---

> [!NOTE/tl;dr]
> I love [mise (aka mise-en-place)](https://mise.jdx.dev) for managing programming language versions.

I'm a bit of a [polyglot engineer](https://eliperkins.com) these days. Most days I write Swift, but there's days I write JavaScript or Ruby or Go or whatever language du jour. Most programming languages and their toolchains share a similar pattern: there's some command line binary you'll need to run to compile/run/interpret your code.

```csharp
$ node someJavaScriptFile.js
$ ruby some_ruby_file.rb
$ swift run SomeSwiftPackage
```

These work just fine if you're working solo from your local developer environment. You do some `brew install` or download some installer for the toolchain from the official website, and you're off running.

## `brew install my-tool@v???`

A new version of your toolchain is released, and you `brew upgrade my-tool` to get the latest version. This works great until you realize your CI/CD or deployment environment is on an older version, or some package of yours isn't ready yet, so you'll need to go back to the previous version.

Easy enough to do `brew install my-tool@v1`, right?

Except now `my-tool` is on version 1.0 _everywhere_ across your computer, and your client's project is actually on `my-tool@v2` already.

You swap between versions by doing a `brew uninstall my-tool@v1 && brew install my-tool@v2` in the morning to do your client work.

You swap back with a `brew uninstall my-tool@v2 && brew install my-tool@v1` in the evening to do your personal work.

_Pure madness_. 😩

## One tool to rule them all

[mise](https://mise.jdx.dev) (aka mise-en-place) helps you manage multiple versions of your toolchains through [a few mechanisms](https://mise.jdx.dev/configuration.html):

- **Global versions**: the default version for your development environment, regardless of current directory.
- **Project versions**: the resolved version for a given project, based on the existence of a `mise.toml` file in the directory tree.
- **[Idiomatic version files](https://mise.jdx.dev/configuration.html#idiomatic-version-files)**: language-specific files like `.ruby-version`, `.nvmrc`, `.go-version`, etc.

Each of these versions coalesce into a set of toolchain versions that are automatically available on your `$PATH` just by changing directories. It's magical.

## "I've used `asdf`/`nvm`/`rbenv` before, this is nothing new."

Yes yes yes, of course. I used `asdf` for years too. But what's great about `mise` is that **it Just Works™ for nearly every language or toolchain that I've encountered**, without needing to install Yet Another Version Manager.

Over my career, I've used `mise` with everything from Go, Node, Ruby, .NET and C#, Java, and Rust. 99.9% of the time, mise works right out of the box. Even when my work project needed to have a different .NET SDK version versus the .NET runtime version, a handful of [symlinks between mise's isolated installs](https://www.hanselman.com/blog/side-by-side-user-scoped-net-core-installations-on-linux-with-dotnetinstallsh) made it easy to jump between projects that had awkward setups.

---

Of the tools I rely on in my development environment, `mise` has become one of the first I install, and one I can rely on out of the box.

Next time you go to `brew install` some programming language or toolchain, think twice, and **use [`mise`](https://mise.jdx.dev) instead**.
