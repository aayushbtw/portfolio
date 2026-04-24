import { cloudflare } from "@cloudflare/vite-plugin";
import contentCollections from "@content-collections/vite";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeExternalLinks, { target: "_blank", rel: ["noopener"] }],
          [rehypePrettyCode, { theme: "github-light", keepBackground: false }],
        ],
      }),
    },
    tailwindcss(),
    contentCollections({ environment: "ssr" }),
    tanstackStart({
      rsc: { enabled: true },
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
      sitemap: {
        enabled: true,
        host: "https://aayush.cv",
      },
      pages: [{ path: "/music", prerender: { enabled: false } }],
    }),
    rsc(),
    viteReact({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    cloudflare({
      viteEnvironment: {
        name: "ssr",
        childEnvironments: ["rsc"],
      },
    }),
  ],
});
