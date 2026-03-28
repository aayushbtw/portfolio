import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import { Showcase } from "./src/components/ui/showcase";
import { renderMdx } from "./src/lib/mdx";

const posts = defineCollection({
  name: "posts",
  directory: "./writings",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    publishedAt: z.string(),
    modifiedAt: z.string().optional(),
    description: z.string(),
    image: z.string().optional(),
  }),
  transform: async (document, _context) => ({
    ...document,
    slug: document._meta.path,
    html: await renderMdx(document.content, { Showcase }),
  }),
});

export default defineConfig({ content: [posts] });
