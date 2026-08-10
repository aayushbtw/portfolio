import {
  defineCollection,
  defineConfig,
  type WriterHook,
} from "@content-collections/core";
import { z } from "zod";

const TITLE_REGEX = /^#\s+(.+?)\s*$/m;
const FIRST_SENTENCE_REGEX = /^.*?\.(?=\s|$)/s;

const posts = defineCollection({
  name: "posts",
  directory: "./content/posts",
  include: "*.md",
  schema: z.object({
    title: z.string(),
    publishedAt: z.string(),
    modifiedAt: z.string().optional(),
    description: z.string(),
    image: z.string().optional(),
    content: z.string(),
  }),
  transform: ({ _meta, ...post }) => ({
    ...post,
    slug: _meta.path,
  }),
});

const skills = defineCollection({
  name: "skills",
  directory: "./content/skills",
  include: "*/SKILL.md",
  schema: z.object({
    name: z.string(),
    description: z.string(),
    content: z.string(),
  }),
  transform: ({ content, name, description }) => ({
    slug: name,
    title: TITLE_REGEX.exec(content)?.[1] ?? name,
    description,
    summary: FIRST_SENTENCE_REGEX.exec(description)?.[0] ?? description,
    content,
  }),
});

// The generated modules inline every post and skill body. Without this they are
// importable from client code, which would ship all of content/ to the browser.
const serverOnlyHook: WriterHook = ({ fileType, content }) => {
  if (fileType === "typeDefinition") {
    return { content };
  }
  return {
    content: `import '@tanstack/react-start/server-only';\n\n${content}`,
  };
};

export default defineConfig({
  content: [posts, skills],
  hooks: {
    writer: [serverOnlyHook],
  },
});
