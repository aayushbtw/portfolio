import * as stylex from "@stylexjs/stylex";
import { foreground } from "~/styles/tokens/color.stylex";
import {
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
} from "~/styles/tokens/typography.stylex";
import { marginBottom, marginTop } from "./scales";

/* A variant is the whole treatment: size, leading, tracking, weight and colour
   were chosen together, so none of them is separately settable. Two elements on
   the same variant have made the same decision, not four matching ones. */

const base = stylex.create({
  reset: {
    // typeset.css puts margin on bare `p` and headings via `--typeset-flow`.
    // Spacing here is the parent Box's job, so the inherited margin is dropped.
    marginBlock: 0,
  },
});

const variants = stylex.create({
  display: {
    fontSize: fontSize["3xl"],
    lineHeight: lineHeight["3xl"],
    letterSpacing: letterSpacing["3xl"],
    fontWeight: fontWeight.medium,
    color: foreground["fg-1"],
  },
  heading: {
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
  lead: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    letterSpacing: letterSpacing.lg,
    fontWeight: fontWeight.regular,
    color: foreground["fg-3"],
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

const ELEMENTS = [
  "p",
  "span",
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
] as const;

type TextElement = (typeof ELEMENTS)[number];

interface TextOwnProps<T extends TextElement> {
  as?: T;
  color?: keyof typeof tone;
  marginBottom?: keyof typeof marginBottom;
  marginTop?: keyof typeof marginTop;
  style?: stylex.StyleXStyles;
  variant?: keyof typeof variants;
}

type TextProps<T extends TextElement> = TextOwnProps<T> &
  Omit<React.ComponentProps<T>, keyof TextOwnProps<T>>;

export function Text<T extends TextElement = "p">({
  as,
  variant = "body",
  color,
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
        mt && marginTop[mt],
        mb && marginBottom[mb],
        style
      )}
    />
  );
}
