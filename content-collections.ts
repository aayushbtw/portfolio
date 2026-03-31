import { defineCollection, defineConfig } from "@content-collections/core";
import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import { createElement } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrettyCode from "rehype-pretty-code";
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
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeExternalLinks, { target: "_blank", rel: ["noopener"] }],
      [rehypePrettyCode, { theme: "github-light", keepBackground: false }],
    ],
  });
  const html = renderToStaticMarkup(
    createElement(Content, { components: props })
  );
  const headings: { id: string; text: string }[] = [];
  for (const match of html.matchAll(/<h2\s+id="([^"]+)"[^>]*>(.+?)<\/h2>/g)) {
    headings.push({ id: match[1], text: match[2].replace(/<[^>]+>/g, "") });
  }
  return { html, headings };
}

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
  transform: async (doc, { cache }) => {
    const { html, headings } = await cache(doc.content, (content) =>
      renderMdx(content, { Showcase, ShowcaseImage, ShowcaseCaption })
    );

    return {
      ...doc,
      slug: doc._meta.path,
      html,
      headings,
    };
  },
});

export default defineConfig({
  content: [posts],
});
