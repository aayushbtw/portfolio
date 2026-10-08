import path from "node:path";

import { cloudflare } from "@cloudflare/vite-plugin";
import stylex from "@stylexjs/unplugin/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { tomekit } from "tomekit/vite";
import ultraciteFmt from "ultracite/oxfmt";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import tanstack from "ultracite/oxlint/tanstack";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  fmt: {
    ...ultraciteFmt,
    ignorePatterns: [
      ...(ultraciteFmt.ignorePatterns ?? []),
      "**/routeTree.gen.ts",
      ".claude/**",
    ],
  },
  lint: {
    extends: [core, react, tanstack, antiSlop],
    ignorePatterns: [...(core.ignorePatterns ?? []), ".claude/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    options: { typeAware: true, typeCheck: true },
    rules: {
      // Hoisting lets a route's `component:` sit above the component it names.
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      "no-use-before-define": ["error", { functions: false }],
      "react/function-component-definition": [
        "error",
        { namedComponents: "function-declaration" },
      ],
      // Base UI's checkbox is a span with a hidden input, so the label wraps it rather than pointing at it.
      "jsx-a11y/label-has-associated-control": [
        "error",
        { controlComponents: ["Checkbox", "Switch"], depth: 3 },
      ],
      // `throw redirect(...)` and `throw notFound()` are how TanStack Router exits a loader.
      "typescript/only-throw-error": [
        "error",
        {
          allow: [
            {
              from: "package",
              name: ["NotFoundError", "Redirect"],
              package: "@tanstack/router-core",
            },
          ],
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
  },
  // oxlint-disable-next-line typescript/no-unsafe-return -- `@stylexjs/unplugin/vite` is typed as returning `any`
  plugins: lazyPlugins(() => [
    tomekit(),
    tanstackStart({
      pages: [
        { path: "/", prerender: { enabled: false } },
        { path: "/music", prerender: { enabled: false } },
      ],
      prerender: {
        crawlLinks: true,
        enabled: true,
      },
      rsc: { enabled: true },
      sitemap: {
        enabled: true,
        host: "https://aayush.cv",
      },
    }),
    rsc(),
    // Before the React plugin, or Fast Refresh breaks.
    stylex({
      aliases: { "~/*": [path.join(import.meta.dirname, "src/*")] },
      // The router transforms client and server code differently, so the line
      // numbers in `data-style-src` disagree and fail hydration.
      enableDebugDataProp: false,
      useCSSLayers: true,
    }),
    viteReact(),
    cloudflare({
      viteEnvironment: {
        childEnvironments: ["rsc"],
        name: "ssr",
      },
    }),
  ]),
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
});
