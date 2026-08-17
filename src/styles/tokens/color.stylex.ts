import * as stylex from "@stylexjs/stylex";

/* Names are the site's existing emphasis ladder, not new ones: `fg-1` is the
   thing you read first, `fg-3` the thing you read last.

   Consts, not vars. `defineVars` would mint a StyleX custom property per token
   that resolves to the plain one below it, which is a second hop for no gain:
   nothing here is themed through `createTheme`. The declarations live in
   app.css because prose.css and reset.css read them too, and StyleX hashes its
   own var names so plain CSS could never refer to them. If dark mode arrives it
   flips those declarations, which reaches both systems at once. */

export const background = stylex.defineConsts({
  "bg-1": "var(--color-bg-1)",
  "bg-2": "var(--color-bg-2)",
  /* Half-strength `bg-2`, for a panel that has to read as a tint over the page
     rather than as its own surface: the border does the separating. */
  "bg-2-soft": "color-mix(in oklch, var(--color-bg-2) 50%, transparent)",
  /* A wash laid over artwork to sink it behind the thing in front of it. */
  "bg-1-veil": "color-mix(in oklch, var(--color-bg-1) 20%, transparent)",
  contrast: "var(--color-bg-contrast)",
  brand: "var(--color-brand)",
  transparent: "transparent",
});

export const foreground = stylex.defineConsts({
  "fg-1": "var(--color-fg-1)",
  "fg-2": "var(--color-fg-2)",
  "fg-3": "var(--color-fg-3)",
  contrast: "var(--color-fg-contrast)",
  brand: "var(--color-brand)",
  inherit: "inherit",
});

/* Contribution levels, empty to busiest. Applied as `fill`, never as text or
   surface colour: they are a scale, not part of the emphasis ladder above. */
export const graph = stylex.defineConsts({
  0: "var(--color-graph-0)",
  1: "var(--color-graph-1)",
  2: "var(--color-graph-2)",
  3: "var(--color-graph-3)",
  4: "var(--color-graph-4)",
});

export const border = stylex.defineConsts({
  default: "var(--color-border)",
  strong: "var(--color-border-strong)",
  brand: "var(--color-brand)",
});
