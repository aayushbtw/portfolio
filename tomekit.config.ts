import type { ComponentNode } from "@tanstack/markdown";
import { commentComponentsExtension } from "@tanstack/markdown/extensions/comment-components";
import { headingCollectionExtension } from "@tanstack/markdown/extensions/headings";
import { parseMarkdown } from "@tanstack/markdown/parser";
import { defineConfig } from "tomekit";
import type { Source, TransformContext } from "tomekit";
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

function parse<TMetadata extends object>(
  { body, metadata, slug }: Source<TMetadata>,
  { collection }: TransformContext
) {
  const document = parseMarkdown(body, { extensions, headingIds: true });
  return {
    body: document,
    metadata: {
      ...metadata,
      headings: (document.headings ?? []).filter((h) => h.level === 2),
      url: `/${collection}/${slug}`,
    },
  };
}

export default defineConfig({
  collections: {
    explorations: {
      directory: "content/explorations",
      schema: z.object({
        description: z.string(),
        publishedAt: z.iso.date(),
        title: z.string(),
      }),
      transform: parse,
    },
    skills: {
      directory: "content/skills",
      schema: z.object({
        category: z.string(),
        description: z.string(),
        publishedAt: z.iso.date(),
        title: z.string(),
      }),
      transform: parse,
    },
    writings: {
      directory: "content/posts",
      schema: z.object({
        description: z.string(),
        image: z.string().optional(),
        modifiedAt: z.iso.date().optional(),
        publishedAt: z.iso.date(),
        title: z.string(),
      }),
      transform: parse,
    },
  },
});
