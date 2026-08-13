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
