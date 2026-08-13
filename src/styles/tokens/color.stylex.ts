import * as stylex from "@stylexjs/stylex";

/* Names are the site's existing emphasis ladder, not new ones: `fg-1` is the
   thing you read first, `fg-3` the thing you read last. */

export const background = stylex.defineVars({
  "bg-1": "var(--color-bg-1)",
  "bg-2": "var(--color-bg-2)",
  contrast: "var(--color-bg-contrast)",
  brand: "var(--color-brand)",
  transparent: "transparent",
});

export const foreground = stylex.defineVars({
  "fg-1": "var(--color-fg-1)",
  "fg-2": "var(--color-fg-2)",
  "fg-3": "var(--color-fg-3)",
  contrast: "var(--color-fg-contrast)",
  brand: "var(--color-brand)",
  inherit: "inherit",
});

/* Contribution levels, empty to busiest. Applied as `fill`, never as text or
   surface colour: they are a scale, not part of the emphasis ladder above. */
export const graph = stylex.defineVars({
  0: "var(--color-graph-0)",
  1: "var(--color-graph-1)",
  2: "var(--color-graph-2)",
  3: "var(--color-graph-3)",
  4: "var(--color-graph-4)",
});

export const border = stylex.defineVars({
  default: "var(--color-border)",
  strong: "var(--color-border-strong)",
  brand: "var(--color-brand)",
});
