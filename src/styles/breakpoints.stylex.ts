import * as stylex from "@stylexjs/stylex";

/* Consts, so the query string is written once and every component that responds
   to width responds at the same width. The site has one breakpoint: below it a
   single column, above it the layout may split. */

export const breakpoint = stylex.defineConsts({
  sm: "@media (min-width: 40rem)",
  md: "@media (min-width: 48rem)",
});
