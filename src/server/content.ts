import "@tanstack/react-start/server-only";
import type { MarkdownDocument } from "@tanstack/markdown";
import { z } from "zod";
import { parseContent } from "~/server/markdown";

// A skill's `description` is written for an agent and runs long. Its first
// sentence is the part addressed to a human.
const FIRST_SENTENCE_REGEX = /^.*?\.(?=\s|$)/s;
const POST_SLUG_REGEX = /^.*\/(.+)\.md$/;
const QUOTED_REGEX = /^(['"])(.*)\1$/;

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
    fields[line.slice(0, colon).trim()] = value.replace(QUOTED_REGEX, "$2");
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
