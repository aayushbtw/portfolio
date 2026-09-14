import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { tomekit } from "tomekit/vite";
import { defineConfig, lazyPlugins } from "vite-plus";

const ignorePatterns = [
  "**/*.gen.*",
  ".claude/**",
  "pnpm-lock.yaml",
  "tools/oxlint/anti-slop/**",
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
    jsPlugins: [
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
      { name: "anti-slop", specifier: "./tools/oxlint/anti-slop/index.ts" },
    ],
    options: { typeAware: true, typeCheck: true },
    rules: {
      "anti-slop/no-array-filter-map": "error",
      "anti-slop/no-chained-type-assertions": "error",
      "anti-slop/no-conditional-empty-object-spread": "error",
      "anti-slop/no-known-value-widening": "error",
      "anti-slop/no-module-mocking": "error",
      "anti-slop/no-object-parameters": "error",
      "anti-slop/no-reduce-accumulator-copy": "error",
      "anti-slop/no-reflect-apply": "error",
      "anti-slop/no-reflect-get": "error",
      "anti-slop/no-runtime-typeof": "error",
      "anti-slop/no-shape-in-symbol-names": "error",
      "anti-slop/no-unknown-parameters": "error",
      "anti-slop/no-unknown-returns": "error",
      "anti-slop/no-unknown-type-aliases": "error",
      "anti-slop/no-unsafe-dictionary-type": "error",
      "anti-slop/no-widen-then-assert": "error",
      "anti-slop/require-readable-spacing": "error",
      "anti-slop/require-safety-comment-for-type-assertion": "error",
      // Hoisting is what lets a route's `component:` sit above the component it
      // names. Callbacks and cleanups stay arrows: this rule only governs named
      // functions bound to a variable.
      "func-style": ["error", "declaration", { allowArrowFunctions: false }],
      // Paired with the rule above: declarations hoist, so naming one further
      // up the file than its definition is the point, not a mistake.
      "no-use-before-define": ["error", { functions: false }],
      "oxc/no-accumulating-spread": "error",
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
