import * as stylex from "@stylexjs/stylex";
import { spacing } from "~/styles/tokens/layout.stylex";

/* Shared by `Box` and `Text` so the two cannot drift into different ideas of
   what `md` means. */

export const gaps = stylex.create({
  none: { gap: spacing.none },
  xs: { gap: spacing.xs },
  sm: { gap: spacing.sm },
  md: { gap: spacing.md },
  lg: { gap: spacing.lg },
  xl: { gap: spacing.xl },
  "2xl": { gap: spacing["2xl"] },
});

export const pad = stylex.create({
  none: { padding: spacing.none },
  xs: { padding: spacing.xs },
  sm: { padding: spacing.sm },
  md: { padding: spacing.md },
  lg: { padding: spacing.lg },
  xl: { padding: spacing.xl },
  "2xl": { padding: spacing["2xl"] },
});

export const padInline = stylex.create({
  none: { paddingInline: spacing.none },
  xs: { paddingInline: spacing.xs },
  sm: { paddingInline: spacing.sm },
  md: { paddingInline: spacing.md },
  lg: { paddingInline: spacing.lg },
  xl: { paddingInline: spacing.xl },
  "2xl": { paddingInline: spacing["2xl"] },
});

export const padBlock = stylex.create({
  none: { paddingBlock: spacing.none },
  xs: { paddingBlock: spacing.xs },
  sm: { paddingBlock: spacing.sm },
  md: { paddingBlock: spacing.md },
  lg: { paddingBlock: spacing.lg },
  xl: { paddingBlock: spacing.xl },
  "2xl": { paddingBlock: spacing["2xl"] },
});

/* Pads the element and pulls the same amount back off its margin, so a
   background or hover fill runs past the text edge while the text stays on the
   column. One prop rather than two opposing ones, because it is one decision
   and two halves that can drift apart is what we are removing. */
export const bleedInline = stylex.create({
  xs: { paddingInline: spacing.xs, marginInline: `calc(-1 * ${spacing.xs})` },
  sm: { paddingInline: spacing.sm, marginInline: `calc(-1 * ${spacing.sm})` },
  md: { paddingInline: spacing.md, marginInline: `calc(-1 * ${spacing.md})` },
  lg: { paddingInline: spacing.lg, marginInline: `calc(-1 * ${spacing.lg})` },
});

export const marginTop = stylex.create({
  none: { marginBlockStart: spacing.none },
  xs: { marginBlockStart: spacing.xs },
  sm: { marginBlockStart: spacing.sm },
  md: { marginBlockStart: spacing.md },
  lg: { marginBlockStart: spacing.lg },
  xl: { marginBlockStart: spacing.xl },
  "2xl": { marginBlockStart: spacing["2xl"] },
});

export const marginBottom = stylex.create({
  none: { marginBlockEnd: spacing.none },
  xs: { marginBlockEnd: spacing.xs },
  sm: { marginBlockEnd: spacing.sm },
  md: { marginBlockEnd: spacing.md },
  lg: { marginBlockEnd: spacing.lg },
  xl: { marginBlockEnd: spacing.xl },
  "2xl": { marginBlockEnd: spacing["2xl"] },
});

export const padBottom = stylex.create({
  none: { paddingBlockEnd: spacing.none },
  xs: { paddingBlockEnd: spacing.xs },
  sm: { paddingBlockEnd: spacing.sm },
  md: { paddingBlockEnd: spacing.md },
  lg: { paddingBlockEnd: spacing.lg },
  xl: { paddingBlockEnd: spacing.xl },
});
