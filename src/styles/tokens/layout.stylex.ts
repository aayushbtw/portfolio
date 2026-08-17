import * as stylex from "@stylexjs/stylex";

/* Consts, not vars: see the note in `color.stylex.ts`. Nothing here is themed,
   so a StyleX custom property per token would only add a hop.

   `spacing` and `radius` point at the plain declarations in app.css because
   prose.css reads the same scales. `iconSize` and `shadow` have no plain-CSS
   consumer, so they hold their values outright. */

export const spacing = stylex.defineConsts({
  none: "0",
  xs: "var(--spacing-xs)",
  sm: "var(--spacing-sm)",
  md: "var(--spacing-md)",
  lg: "var(--spacing-lg)",
  xl: "var(--spacing-xl)",
  "2xl": "var(--spacing-2xl)",
});

/* Icon sizes. `md` is the icon that sits beside body text; `sm` is the one that
   sits beside a number and must not outweigh it. */
export const iconSize = stylex.defineConsts({
  sm: "0.625rem",
  md: "1rem",
});

/* One shadow, for the one thing that lifts off the page: a screenshot sitting
   on its backdrop. A second step would need a reason to exist. */
export const shadow = stylex.defineConsts({
  lifted:
    "0 25px 50px -12px color-mix(in oklch, var(--color-fg-1) 25%, transparent)",
});

export const radius = stylex.defineConsts({
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
});
