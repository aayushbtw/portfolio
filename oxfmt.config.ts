import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    // Vendored from shadcn/typeset, kept byte-for-byte.
    "src/styles/typeset.css",
    "worker-configuration.d.ts",
  ],
});
