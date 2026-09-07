import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import tanstack from "ultracite/oxlint/tanstack";

export default defineConfig({
  extends: [core, tanstack],
  ignorePatterns: [...(core.ignorePatterns ?? []), "worker-configuration.d.ts"],
  rules: {
    // Hoisting is what lets a route's `component:` sit above the component it
    // names. Callbacks and cleanups stay arrows: this rule only governs named
    // functions bound to a variable.
    "func-style": ["error", "declaration", { allowArrowFunctions: false }],
    // Paired with the rule above: declarations hoist, so naming one further
    // up the file than its definition is the point, not a mistake.
    "no-use-before-define": ["error", { functions: false }],
  },
});
