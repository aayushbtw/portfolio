import * as stylex from "@stylexjs/stylex";

/* Consts, not vars: the type scale is never themed or overridden at runtime,
   so these inline at build time instead of costing a custom property each.

   Each step is a triple. A size is never applied without the leading and
   tracking that were chosen with it, which is why `Text` takes a variant and
   not a `fontSize`. */

export const fontFamily = stylex.defineConsts({
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
});

export const fontWeight = stylex.defineConsts({
  regular: "var(--font-weight-regular)",
  medium: "var(--font-weight-medium)",
});

export const fontSize = stylex.defineConsts({
  xs: "var(--text-xs)",
  base: "var(--text-base)",
  lg: "var(--text-lg)",
  "3xl": "var(--text-3xl)",
});

export const lineHeight = stylex.defineConsts({
  xs: "var(--text-xs--line-height)",
  base: "var(--text-base--line-height)",
  lg: "var(--text-lg--line-height)",
  "3xl": "var(--text-3xl--line-height)",
});

export const letterSpacing = stylex.defineConsts({
  xs: "var(--text-xs--letter-spacing)",
  base: "var(--text-base--letter-spacing)",
  lg: "var(--text-lg--letter-spacing)",
  "3xl": "var(--text-3xl--letter-spacing)",
});
