import { defineCollection, defineConfig } from "@content-collections/core";
import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import rehypeExternalLinks from "rehype-external-links";
import { rehypePrettyCode } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { z } from "zod";

import {
  Showcase,
  ShowcaseCaption,
  ShowcaseImage,
} from "./src/components/ui/showcase";

async function renderMdx(
  content: string,
  props: MDXComponents = {}
): Promise<{ html: string; headings: { id: string; text: string }[] }> {
  const { default: Content } = await evaluate(content, {
    Fragment,
    jsx,
    jsxs,
    rehypePlugins: [
      rehypeSlug,
      [rehypeExternalLinks, { rel: ["noopener"], target: "_blank" }],
      [rehypePrettyCode, { keepBackground: false, theme: "github-light" }],
    ],
    remarkPlugins: [remarkGfm],
  });
  const html = renderToStaticMarkup(
    createElement(Content, { components: props })
  );
  const headings: { id: string; text: string }[] = [];
  for (const match of html.matchAll(/<h2\s+id="([^"]+)"[^>]*>(.+?)<\/h2>/g)) {
    headings.push({ id: match[1], text: match[2].replaceAll(/<[^>]+>/g, "") });
  }
  return { headings, html };
}

const posts = defineCollection({
  directory: "./writings",
  include: "*.mdx",
  name: "posts",
  schema: z.object({
    content: z.string(),
    description: z.string(),
    image: z.string().optional(),
    modifiedAt: z.string().optional(),
    publishedAt: z.string(),
    title: z.string(),
  }),
  transform: async (doc, { cache }) => {
    const { html, headings } = await cache(doc.content, (content) =>
      renderMdx(content, { Showcase, ShowcaseCaption, ShowcaseImage })
    );

    return {
      ...doc,
      headings,
      html,
      slug: doc._meta.path,
    };
  },
});

export default defineConfig({
  content: [posts],
});
