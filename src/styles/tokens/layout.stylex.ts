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

export const radius = stylex.defineVars({
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
});
