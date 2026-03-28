import { defineCollection, defineConfig } from "@content-collections/core";
import { evaluate } from "@mdx-js/mdx";
import { Showcase } from "./src/components/ui/showcase";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { z } from "zod";

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
  transform: async (document, _context) => {
    const { default: Content } = await evaluate(document.content, {
      Fragment,
      jsx,
      jsxs,
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeExternalLinks, { target: "_blank", rel: ["noopener"] }],
        [rehypePrettyCode, { theme: "github-light", keepBackground: false }],
      ],
    });
    const html = renderToStaticMarkup(createElement(Content, { components: { Showcase } }));
    return {
      ...document,
      slug: document._meta.path,
      html,
    };
  },
});

export default defineConfig({ content: [posts] });
