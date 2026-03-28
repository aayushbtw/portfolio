import { evaluate } from "@mdx-js/mdx";
import { createElement } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export async function renderMdx(
  content: string,
  components: Record<string, unknown> = {}
): Promise<string> {
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
  return renderToStaticMarkup(createElement(Content, { components }));
}
