import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import { renderMarkdown } from "./src/lib/markdown";

const posts = defineCollection({
  name: "posts",
  directory: "./writings",
  include: "*.md",
  schema: z.object({
    title: z.string(),
    publishedAt: z.string(),
    description: z.string(),
    image: z.string().optional(),
    content: z.string(),
  }),
  transform: async ({ content, ...post }) => ({
    ...post,
    slug: post._meta.path,
    html: await renderMarkdown(content),
  }),
});

export default defineConfig({ content: [posts] });
