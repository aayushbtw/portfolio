import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    // Vendored from shadcn/typeset, kept byte-for-byte.
    "src/styles/typeset.css",
    // A submodule with its own repo and its own formatting.
    "content/skills/**",
    "worker-configuration.d.ts",
  ],
});
