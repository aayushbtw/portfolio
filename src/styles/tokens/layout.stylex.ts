import * as stylex from "@stylexjs/stylex";

/* Values indirect through the Tailwind `@theme` vars rather than restating the
   numbers, so the two systems cannot drift while both are live. When Tailwind
   goes, inline the literals here and the indirection disappears. */

export const spacing = stylex.defineVars({
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
export const iconSize = stylex.defineVars({
  sm: "0.625rem",
  md: "1rem",
});

/* One shadow, for the one thing that lifts off the page: a screenshot sitting
   on its backdrop. A second step would need a reason to exist. */
export const shadow = stylex.defineVars({
  lifted:
    "0 25px 50px -12px color-mix(in oklch, var(--color-fg-1) 25%, transparent)",
});

export const radius = stylex.defineVars({
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
});
