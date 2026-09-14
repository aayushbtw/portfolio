import type { ComponentNode } from "@tanstack/markdown";
import { commentComponentsExtension } from "@tanstack/markdown/extensions/comment-components";
import { headingCollectionExtension } from "@tanstack/markdown/extensions/headings";
import { parseMarkdown } from "@tanstack/markdown/parser";
import { defineCollection, defineConfig } from "tomekit";
import type { BaseDocument, TransformContext } from "tomekit";
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

function parse<T extends BaseDocument>(
  { content, file: _file, slug, ...frontmatter }: T,
  { collection }: TransformContext
) {
  const document = parseMarkdown(content, { extensions, headingIds: true });
  return {
    ...frontmatter,
    document,
    headings: (document.headings ?? []).filter((h) => h.level === 2),
    slug,
    url: `/${collection}/${slug}`,
  };
}

export default defineConfig({
  collections: {
    explorations: defineCollection({
      directory: "content/explorations",
      schema: z.object({
        description: z.string(),
        publishedAt: z.iso.date(),
        title: z.string(),
      }),
      transform: parse,
    }),
    skills: defineCollection({
      directory: "content/skills",
      schema: z.object({
        category: z.string(),
        description: z.string(),
        title: z.string(),
      }),
      transform: parse,
    }),
    writings: defineCollection({
      directory: "content/posts",
      schema: z.object({
        description: z.string(),
        image: z.string().optional(),
        modifiedAt: z.iso.date().optional(),
        publishedAt: z.iso.date(),
        title: z.string(),
      }),
      transform: parse,
    }),
  },
});
