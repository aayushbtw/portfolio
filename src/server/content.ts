import "@tanstack/react-start/server-only";
import type { MarkdownDocument } from "@tanstack/markdown";
import { notFound } from "@tanstack/react-router";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { z } from "zod";

import { parseContent, renderMarkdown } from "~/server/markdown";

const SLUG_REGEX = /^.*\/(?<slug>.+)\.md$/u;
const QUOTED_REGEX = /^(?<quote>['"])(?<value>.*)\k<quote>$/u;

// Splitting on the first colon covers every field this site uses and keeps the
// `yaml` package out of the Worker. It does NOT handle nested maps,
// lists, multi-line values, `#` comments, or typed scalars (`published: true`
// arrives as "true"). A field needing any of those means a real parser.
function parseFrontmatter(text: string): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) {
      continue;
    }
    const value = line.slice(colon + 1).trim();
    fields[line.slice(0, colon).trim()] = value.replace(
      QUOTED_REGEX,
      "$<value>"
    );
  }
  return fields;
}

// Every collection on this site is the same shape: markdown files with
// frontmatter, keyed by filename. Only the frontmatter differs, so that is the
// only thing a caller passes.
//
// Zod names the offending field but not the file, and the prerender stack
// points at the glob rather than the content, so the path has to be in the
// message.
function collection<TFrontmatter>(
  files: Record<string, string>,
  schema: z.ZodType<TFrontmatter>
) {
  return Object.entries(files).map(([path, raw]) => {
    const document = parseContent(raw);
    if (document.frontmatter === undefined) {
      throw new Error(`${path}: no frontmatter block`);
    }
    const result = schema.safeParse(parseFrontmatter(document.frontmatter));
    if (!result.success) {
      throw new Error(`${path}: ${z.prettifyError(result.error)}`);
    }
    return {
      ...result.data,
      document,
      slug: path.replace(SLUG_REGEX, "$<slug>"),
    };
  });
}

// Vite inlines every match at build time, which is required: the Worker has no
// filesystem at runtime. Both argument literals must stay inline, since Vite
// parses this call statically and rejects a shared options constant.
const postFiles = import.meta.glob<string>("/content/posts/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

const skillFiles = import.meta.glob<string>("/content/skills/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

const baseFrontmatter = z.object({
  description: z.string(),
  title: z.string(),
});

const allSkills = collection(skillFiles, baseFrontmatter);

const allPosts = collection(
  postFiles,
  baseFrontmatter.extend({
    image: z.string().optional(),
    modifiedAt: z.string().optional(),
    publishedAt: z.string(),
  })
);

// The document itself never leaves the server: callers get the rendered body.
async function loadEntry<
  TEntry extends { document: MarkdownDocument; slug: string },
>(entries: TEntry[], slug: string) {
  const entry = entries.find((candidate) => candidate.slug === slug);
  if (!entry) {
    throw notFound();
  }

  const { document, ...meta } = entry;

  return {
    ...meta,
    body: await renderServerComponent(renderMarkdown(document)),
    headings: (document.headings ?? []).filter((h) => h.level === 2),
  };
}

export { allPosts, allSkills, loadEntry };
