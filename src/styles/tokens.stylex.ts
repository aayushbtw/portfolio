import * as stylex from "@stylexjs/stylex";

// Named by role, valued by Radix step.
export const colors = stylex.defineVars({
  accent: "#111111",
  background: "var(--gray-1)",
  borderStrong: "var(--gray-a6)",
  fill: "var(--gray-a3)",
  fillStrong: "var(--gray-a4)",
  fillSubtle: "var(--gray-a2)",
  shadow: "var(--black-a6)",
  textMuted: "var(--gray-9)",
  textPrimary: "var(--gray-12)",
  textSecondary: "var(--gray-11)",
});

export const fonts = stylex.defineConsts({
  mono: 'ui-monospace, "SF Mono", Menlo, monospace',
  sans: '"Inter Variable", -apple-system, BlinkMacSystemFont, sans-serif',
});

export const fontSizes = stylex.defineConsts({
  base: "15px",
  display: "96px",
  sm: "14px",
  xs: "13px",
});

export const lineHeights = stylex.defineConsts({
  code: "20px",
  prose: "24px",
  row: "18px",
});

export const space = stylex.defineConsts({
  xxs: "4px",
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "48px",
});

export const radii = stylex.defineConsts({
  full: "9999px",
  md: "12px",
  sm: "8px",
  xs: "4px",
});

export const media = stylex.defineConsts({
  hover: "@media (hover: hover)",
  lg: "@media (min-width: 1280px)",
  sm: "@media (min-width: 640px)",
});

export const layout = stylex.defineConsts({
  columnGap: "48px",
  content: "644px",
  gutter: "16px",
  pageBottom: "96px",
  pageTop: "96px",
  sectionGap: "48px",
});

export const easings = stylex.defineConsts({
  // For things that travel across the screen: leave and arrive gently.
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
  out: "cubic-bezier(0.23, 1, 0.32, 1)",
  // A small overshoot, for elements that should feel alive.
  overshoot: "cubic-bezier(0.34, 1.56, 0.64, 1)",
});

export const durations = stylex.defineConsts({
  enter: "700ms",
  hover: "150ms",
  popover: "180ms",
  press: "160ms",
});
