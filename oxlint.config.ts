import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import tanstack from "ultracite/oxlint/tanstack";

export default defineConfig({
  extends: [core, tanstack],
  ignorePatterns: [...core.ignorePatterns, "worker-configuration.d.ts"],
});
