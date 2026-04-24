import {
  createDefaultImport,
  defineCollection,
  defineConfig,
  type WriterHook,
} from "@content-collections/core";
import type { MDXContent } from "mdx/types";
import { z } from "zod";

const HEADING_REGEX = /^##\s+(.+?)\s*$/gm;

function getSlugFromHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractHeadings(source: string): { id: string; text: string }[] {
  return Array.from(source.matchAll(HEADING_REGEX), (m) => {
    const text = m[1].trim();
    return { id: getSlugFromHeading(text), text };
  });
}

const posts = defineCollection({
  name: "posts",
  directory: "./src/writings",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    publishedAt: z.string(),
    modifiedAt: z.string().optional(),
    description: z.string(),
    image: z.string().optional(),
    content: z.string(),
  }),
  transform: ({ _meta, content, ...post }) => {
    const mdx = createDefaultImport<MDXContent>(`~/writings/${_meta.filePath}`);
    return {
      ...post,
      slug: _meta.path,
      mdx,
      headings: extractHeadings(content),
    };
  },
});

const serverOnlyHook: WriterHook = ({ fileType, content }) => {
  if (fileType === "typeDefinition") {
    return { content };
  }
  return {
    content: `import '@tanstack/react-start/server-only';\n\n${content}`,
  };
};

export default defineConfig({
  content: [posts],
  hooks: {
    writer: [serverOnlyHook],
  },
});
