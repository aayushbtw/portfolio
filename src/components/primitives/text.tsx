import * as stylex from "@stylexjs/stylex";
import { foreground } from "~/styles/tokens/color.stylex";
import {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
} from "~/styles/tokens/typography.stylex";
import { marginBottom, marginTop } from "./scales";
import type { StyleProp } from "./style-prop";

/* A variant is the whole treatment: size, leading, tracking, weight and colour
   were chosen together, so none of them is separately settable. Two elements on
   the same variant have made the same decision, not four matching ones. */

const base = stylex.create({
  reset: {
    // prose.css puts flow margin on `p` and headings inside rendered markdown.
    // Spacing here is the parent Box's job, so any inherited margin is dropped.
    marginBlock: 0,
  },
});

const variants = stylex.create({
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
  "section-label": {
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
     are scanned rather than read, so they sit closer together than prose does.
     The site already made this call as `leading-5` on the list; naming it here
     is what stops the next row from picking a different number. */
  row: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.base,
    fontWeight: fontWeight.regular,
    color: foreground["fg-3"],
  },
  /* The name of the thing a row points at, stacked above its description.
     One step up the emphasis ladder from `row`, and nothing else: it is the
     label on a target, not a heading. */
  "row-title": {
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

const tone = stylex.create({
  "fg-1": { color: foreground["fg-1"] },
  "fg-2": { color: foreground["fg-2"] },
  "fg-3": { color: foreground["fg-3"] },
  contrast: { color: foreground.contrast },
  brand: { color: foreground.brand },
  inherit: { color: foreground.inherit },
});

/* Digits that have to line up in a column: dates, counts, years. Never the
   default, since tabular figures read worse in running text. */
const numerals = stylex.create({
  tabular: { fontVariantNumeric: "tabular-nums" },
});

/* One line, clipped with an ellipsis. Only works if an ancestor can shrink, so
   the flex parent usually needs `shrink` too. */
const clipping = stylex.create({
  on: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

const ELEMENTS = [
  "p",
  "span",
  "time",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "em",
  "label",
  "figcaption",
  "code",
] as const;

type TextElement = (typeof ELEMENTS)[number];

interface TextOwnProps<T extends TextElement> {
  as?: T;
  color?: keyof typeof tone;
  marginBottom?: keyof typeof marginBottom;
  marginTop?: keyof typeof marginTop;
  numeric?: keyof typeof numerals;
  style?: StyleProp;
  truncate?: boolean;
  variant?: keyof typeof variants;
}

// See the note in `Box`: a class string is the surface this system closes.
type TextProps<T extends TextElement> = TextOwnProps<T> &
  Omit<React.ComponentProps<T>, keyof TextOwnProps<T> | "className">;

export function Text<T extends TextElement = "p">({
  as,
  variant = "body",
  color,
  numeric,
  truncate,
  marginTop: mt,
  marginBottom: mb,
  style,
  ...rest
}: TextProps<T>) {
  // See the note in `Box`: the element union widens `ref` past any single tag.
  const Element = (as ?? "p") as React.ElementType;

  return (
    <Element
      {...rest}
      {...stylex.props(
        base.reset,
        variants[variant],
        color && tone[color],
        numeric && numerals[numeric],
        truncate && clipping.on,
        mt && marginTop[mt],
        mb && marginBottom[mb],
        style
      )}
    />
  );
}
