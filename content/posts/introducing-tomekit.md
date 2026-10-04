---
title: Introducing tomekit
description: A content collections library for Vite that parses your Markdown once, types every slug, and refuses to ship content it can't check.
publishedAt: 2026-09-16
---

<!-- ::start:showcase -->

<!-- ::showcase-image src="/writings/tomekit.png" alt="tomekit" height="630" -->
<!-- ::end:showcase -->

Every Markdown blog grows the same glue code: read a folder, parse the frontmatter, cast it to a type you hope is right, and filter out drafts on every request. [tomekit](https://tomekit.aayush.cv) replaces that glue with one config file, and this site runs on it.

<!-- ::install command="npm install tomekit" -->

## What it does

Point a collection at a folder and give it a schema in `tomekit.config.ts`:

```ts
import { defineConfig, directory } from "tomekit";
import { z } from "zod";

export default defineConfig({
  collections: {
    posts: {
      loader: directory("content/posts"),
      schema: z.strictObject({
        title: z.string(),
        date: z.coerce.date(),
      }),
    },
  },
});
```

While Vite builds, tomekit reads every file, checks its frontmatter against the schema, and writes the result into a generated module. Your pages import it like any other data:

```ts
import { collections } from "tomekit/content";

const post = collections.get("posts").get("hello-world");
post.metadata.date; // Date, because the schema coerced it
```

The schema can be Zod, Valibot, ArkType or anything else that implements [Standard Schema](https://standardschema.dev). An optional `transform` renders the body, adds derived fields like a URL, or skips a document, eg a draft. Collections can also reference each other, so a post's `author` has to be the slug of an author that exists.

## Type safety

The types only promise what the build checked. Collection names come from your config and slugs come from your files, so `get("hello-world")` returns a post, and `get("helo-world")` is a type error instead of a 404 in production.

A slug from a URL is a plain string, so the same call returns the post or `undefined`, and TypeScript makes you handle the miss.

Whatever `transform` returns, like rendered HTML or a Markdown AST, becomes the document's type. A reference field is typed as the other collection's slugs, so following it needs no `undefined` check either.

In dev, drafts keep their types, so you can preview and link them like any other post. A production build skips them, so they add nothing to the bundle.

## Performance

The generated module holds finished data. Your server bundle ships no Markdown parser, and reading a post is a synchronous lookup.

In dev, a change reloads its collection and reruns `transform` only for files whose content changed. On an M2 Pro, with this site's Markdown transform, editing one post takes about 100 ms with 1,000 posts. At 10,000 posts it takes about 1 s, because every file is still read and hashed. There's no cache on disk, so starting dev parses everything again: about 0.7 s for 1,000 posts.

## Design choices

Most content bugs don't crash anything. A slug falls back to the file name, a post names an author who doesn't exist, or a typo in a folder path builds a blog with no posts. The site deploys and looks fine until someone clicks.

A warning scrolls past in CI and nobody reads it, so tomekit fails the build instead: on an empty `slug`, a reference to a missing document, a directory that doesn't exist, or a `transform` that returns something that can't be written into a module, like a function or a class instance.

It only warns when the content could be right on purpose. An empty directory might be a blog with no posts yet. Unknown frontmatter keys are up to the schema: `z.object` drops them and `z.strictObject` fails on them, which is why every example uses strict.

When the build fails, you get every broken file in one pass, each with its line and the fix:

```
content/posts/hello.md:2:1: title: Invalid input: expected string, received undefined
content/posts/typo.md:4:1: author: no document in collection "authors" has the slug "adaa". Fix the slug, or add a document with it to "authors"
```

Dev is gentler. The errors show in Vite's overlay, broken documents are left out, and the rest of the site keeps working while you fix them.

## Limitations

- **No runtime loading.** A new post or a CMS edit shows up after you rebuild.
- **No built-in renderer.** You bring your own Markdown parser and call it in `transform`.
- **Vite only, and only current versions.** Vite 8, TypeScript 7 and Node 24 or newer.

## Try it

tomekit is a work in progress, so expect a lot of breaking changes. Start with the [docs](https://tomekit.aayush.cv), check the [changelog](https://github.com/aayushbtw/tomekit/blob/main/packages/tomekit/CHANGELOG.md) for updates, and [open an issue](https://github.com/aayushbtw/tomekit/issues) for a bug or a feature you want.
