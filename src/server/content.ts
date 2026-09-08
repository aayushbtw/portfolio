import "@tanstack/react-start/server-only";
import type { MarkdownDocument } from "@tanstack/markdown";
import { z } from "zod";

import { parseContent } from "~/server/markdown";

const POST_SLUG_REGEX = /^.*\/(?<slug>.+)\.md$/u;
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

// Zod names the offending field but not the file, and the prerender stack
// points at the glob rather than the content, so the path has to be in the
// message.
function collect<TFrontmatter, TEntry>(
  files: Record<string, string>,
  schema: z.ZodType<TFrontmatter>,
  build: (
    frontmatter: TFrontmatter,
    document: MarkdownDocument,
    path: string
  ) => TEntry
): TEntry[] {
  return Object.entries(files).map(([path, raw]) => {
    const document = parseContent(raw);
    if (document.frontmatter === undefined) {
      throw new Error(`${path}: no frontmatter block`);
    }
    const result = schema.safeParse(parseFrontmatter(document.frontmatter));
    if (!result.success) {
      throw new Error(`${path}: ${z.prettifyError(result.error)}`);
    }
    return build(result.data, document, path);
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

const allPosts = collect(
  postFiles,
  z.object({
    description: z.string(),
    image: z.string().optional(),
    modifiedAt: z.string().optional(),
    publishedAt: z.string(),
    title: z.string(),
  }),
  (frontmatter, document, path) => ({
    ...frontmatter,
    document,
    slug: path.replace(POST_SLUG_REGEX, "$<slug>"),
  })
);

export { allPosts };
