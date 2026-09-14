import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { tomekit } from "tomekit/vite";
import { defineConfig, lazyPlugins } from "vite-plus";

const ignorePatterns = [
  "**/*.gen.*",
  "pnpm-lock.yaml",
  "worker-configuration.d.ts",
];

export default defineConfig({
  fmt: {
    arrowParens: "always",
    bracketSameLine: false,
    bracketSpacing: true,
    endOfLine: "lf",
    ignorePatterns: [
      ...ignorePatterns,
      // Keeps oxfmt off the hand-ordered `@apply` lists in the site's own block.
      "src/styles/typeset.css",
    ],
    jsxSingleQuote: false,
    printWidth: 80,
    proseWrap: "never",
    quoteProps: "as-needed",
    semi: true,
    singleQuote: false,
    sortImports: { ignoreCase: true, newlinesBetween: true, order: "asc" },
    sortPackageJson: true,
    sortTailwindcss: {
      functions: ["clsx", "cva", "tw", "twMerge", "cn", "twJoin", "tv"],
    },
    tabWidth: 2,
    trailingComma: "es5",
    useTabs: false,
  },
  lint: {
    ignorePatterns,
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    options: { typeAware: true, typeCheck: true },
    rules: {
      // Hoisting is what lets a route's `component:` sit above the component it
      // names. Callbacks and cleanups stay arrows: this rule only governs named
      // functions bound to a variable.
      "func-style": ["error", "declaration", { allowArrowFunctions: false }],
      // Paired with the rule above: declarations hoist, so naming one further
      // up the file than its definition is the point, not a mistake.
      "no-use-before-define": ["error", { functions: false }],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
  },
  plugins: lazyPlugins(() => [
    tomekit(),
    tailwindcss(),
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
