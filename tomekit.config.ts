import type { ComponentNode } from "@tanstack/markdown";
import { commentComponentsExtension } from "@tanstack/markdown/extensions/comment-components";
import { headingCollectionExtension } from "@tanstack/markdown/extensions/headings";
import { parseMarkdown } from "@tanstack/markdown/parser";
import { defineCollection, defineConfig } from "tomekit";
import { z } from "zod";

// A comment component with no `tagName` renders as one generic element for every
// name, so the components map cannot tell `showcase` from `showcase-image`.
// Naming the tag is what makes it addressable.
function transformComponent(node: ComponentNode): ComponentNode {
  return { ...node, properties: node.attributes, tagName: `md-${node.name}` };
}

const extensions = [
  commentComponentsExtension({ transformComponent }),
  headingCollectionExtension(),
];

function parse<T extends { content: string; file: unknown; slug: string }>(
  { content, file: _file, slug, ...frontmatter }: T,
  section: string
) {
  const document = parseMarkdown(content, { extensions, headingIds: true });
  return {
    ...frontmatter,
    document,
    headings: (document.headings ?? []).filter((h) => h.level === 2),
    slug,
    url: `/${section}/${slug}`,
  };
}

// Frontmatter dates stay calendar-day strings: `~/lib/utils` parses them in UTC.
const date = z.string();

const writings = defineCollection({
  directory: "content/posts",
  include: "*.md",
  name: "writings",
  schema: z.object({
    description: z.string(),
    image: z.string().optional(),
    modifiedAt: date.optional(),
    publishedAt: date,
    title: z.string(),
  }),
  transform: (document) => parse(document, "writings"),
});

const skills = defineCollection({
  directory: "content/skills",
  include: "*.md",
  name: "skills",
  schema: z.object({
    category: z.string(),
    description: z.string(),
    title: z.string(),
  }),
  transform: (document) => parse(document, "skills"),
});

const explorations = defineCollection({
  directory: "content/explorations",
  include: "*.md",
  name: "explorations",
  schema: z.object({
    description: z.string(),
    publishedAt: date,
    title: z.string(),
  }),
  transform: (document) => parse(document, "explorations"),
});

export default defineConfig({
  collections: [writings, skills, explorations],
});
