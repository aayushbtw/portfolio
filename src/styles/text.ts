import * as stylex from "@stylexjs/stylex";
import { foreground } from "./tokens/color.stylex";
import {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
} from "./tokens/typography.stylex";

/* The site's type treatments, as a shared style map.
 *
 * A treatment is the whole thing: size, leading, tracking, weight and colour
 * were chosen together, so none of them is separately settable. Two elements on
 * the same treatment have made one decision, not five matching ones.
 *
 * Composed at the call site (`stylex.props(text.heading)`) rather than dispatched
 * through a component prop. Because each key is reached statically, the compiler
 * drops the ones nothing imports; a `text[variant]` lookup would ship all of
 * them. Nothing resets margin here: reset.css already zeroes it everywhere, and
 * prose.css only puts it back inside rendered markdown.
 */
export const text = stylex.create({
  /* The one display step there is. */
  display: {
    // Headings wrap into even lines rather than a long line and a runt.
    textWrap: "balance",
    fontSize: fontSize["3xl"],
    lineHeight: lineHeight["3xl"],
    letterSpacing: letterSpacing["3xl"],
    fontWeight: fontWeight.medium,
    color: foreground["fg-1"],
  },
  heading: {
    // Headings wrap into even lines rather than a long line and a runt.
    textWrap: "balance",
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.base,
    fontWeight: fontWeight.medium,
    color: foreground["fg-1"],
  },
  /* The `h2` above a list. Body size and body weight: it separates from the
     content it introduces by colour alone, so it never shouts over it. */
  sectionLabel: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.base,
    fontWeight: fontWeight.regular,
    color: foreground["fg-3"],
  },
  body: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.base,
    fontWeight: fontWeight.regular,
    color: foreground["fg-3"],
  },
  /* Body size on a tighter line box, for text stacked inside a list row. Rows
     are scanned rather than read, so they sit closer together than prose does. */
  row: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.base,
    fontWeight: fontWeight.regular,
    color: foreground["fg-3"],
  },
  /* The name of the thing a row points at, stacked above its description. One
     step up the emphasis ladder from `row`, and nothing else: it is the label on
     a target, not a heading. */
  rowTitle: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.base,
    fontWeight: fontWeight.regular,
    color: foreground["fg-2"],
  },
  lead: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    letterSpacing: letterSpacing.lg,
    fontWeight: fontWeight.regular,
    color: foreground["fg-3"],
  },
  /* Anything the reader is meant to copy or type: a command, an identifier.
     Monospace is the signal that the characters matter literally. */
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.xs,
    fontWeight: fontWeight.regular,
    color: foreground["fg-2"],
  },
  label: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.xs,
    fontWeight: fontWeight.regular,
    color: foreground["fg-3"],
  },
});

/* Colour overrides, for the cases where a treatment is right but the emphasis
   is not: a `row` description that has to read as the primary line, a `label`
   on an inverted surface. Applied after a treatment, never instead of one. */
export const tone = stylex.create({
  "fg-1": { color: foreground["fg-1"] },
  "fg-2": { color: foreground["fg-2"] },
  "fg-3": { color: foreground["fg-3"] },
  contrast: { color: foreground.contrast },
  brand: { color: foreground.brand },
});

/* Digits that have to line up in a column: dates, counts, years. Never the
   default, since tabular figures read worse in running text. */
export const numeric = stylex.create({
  tabular: { fontVariantNumeric: "tabular-nums" },
});

/* One line, clipped with an ellipsis. Only works if an ancestor can shrink, so
   the flex parent usually needs `minWidth: 0` too. */
export const truncate = stylex.create({
  on: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});
