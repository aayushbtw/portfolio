import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    // Keeps oxfmt off the hand-ordered `@apply` lists in the site's own block.
    "src/styles/typeset.css",
    "worker-configuration.d.ts",
  ],
});
