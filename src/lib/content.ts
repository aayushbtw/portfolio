import "@tanstack/react-start/server-only";
import type { MarkdownDocument } from "@tanstack/markdown";
import { z } from "zod";
import { parseContent } from "~/lib/markdown";

// A skill's `description` is written to tell an agent when to invoke it, so it
// runs on past where a reader stops caring. The first sentence is the part
// addressed to a human, and it is what the list and the meta description show.
const FIRST_SENTENCE_REGEX = /^.*?\.(?=\s|$)/s;
const POST_SLUG_REGEX = /^.*\/(.+)\.md$/;
const QUOTED_REGEX = /^(['"])(.*)\1$/;

// Every frontmatter field on this site is a single-line string, so splitting on
// the first colon covers all of them and keeps the `yaml` package (30KB gz) out
// of the Worker. It does NOT handle nested maps, lists, multi-line values, `#`
// comments, or typed scalars: `published: true` arrives as the string "true".
// Add a field that needs any of those and this has to go back to a real parser.
function parseFrontmatter(text: string): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) {
      continue;
    }
    const value = line.slice(colon + 1).trim();
    fields[line.slice(0, colon).trim()] = value.replace(QUOTED_REGEX, "$2");
  }
  return fields;
}

// Zod names the offending field but not the file, and these throw during
// prerender where the stack points at the glob rather than the content. The path
// has to be in the message or a bad post is a scavenger hunt.
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

// Vite inlines every match at build time. That is the requirement, not a
// convenience: the Worker has no filesystem to read content/ from at runtime.
// Both argument literals must stay inline; Vite parses this call statically and
// rejects a shared options constant.
const postFiles = import.meta.glob<string>("/content/posts/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

const skillFiles = import.meta.glob<string>("/content/skills/*/SKILL.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

const allPosts = collect(
  postFiles,
  z.object({
    title: z.string(),
    publishedAt: z.string(),
    modifiedAt: z.string().optional(),
    description: z.string(),
    image: z.string().optional(),
  }),
  (frontmatter, document, path) => ({
    ...frontmatter,
    slug: path.replace(POST_SLUG_REGEX, "$1"),
    document,
  })
);

const allSkills = collect(
  skillFiles,
  z.object({ name: z.string(), description: z.string() }),
  ({ name, description }, document) => ({
    slug: name,
    title: document.headings?.find((h) => h.level === 1)?.text ?? name,
    description,
    summary: FIRST_SENTENCE_REGEX.exec(description)?.[0] ?? description,
    document,
  })
);

export { allPosts, allSkills };
