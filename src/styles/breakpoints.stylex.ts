import * as stylex from "@stylexjs/stylex";

/* Consts, so the query string is written once and every component that responds
   to width responds at the same width.

   Three steps, each with a job: `sm` splits a strip of peers, `md` splits a
   pair of columns, `lg` is where the page is wide enough to carry a sidebar
   beside the content. */

export const breakpoint = stylex.defineConsts({
  sm: "@media (min-width: 40rem)",
  md: "@media (min-width: 48rem)",
  lg: "@media (min-width: 64rem)",
});
