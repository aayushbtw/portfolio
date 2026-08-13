import * as stylex from "@stylexjs/stylex";
import { background, border } from "~/styles/tokens/color.stylex";
import { radius } from "~/styles/tokens/layout.stylex";
import { gaps, marginBottom, marginTop, pad } from "./scales";

/* Every prop below is a hand-written lookup map. `stylex.create` only accepts
   static object literals, so a scale cannot be mapped over. Adding a prop, or a
   value to a scale, means adding entries here by hand. That cost is the point:
   the set of expressible styles is exactly the set someone typed out. */

const layout = stylex.create({
  block: { display: "block" },
  flex: { display: "flex" },
  inlineFlex: { display: "inline-flex" },
  grid: { display: "grid" },
  none: { display: "none" },
});

const direction = stylex.create({
  row: { flexDirection: "row" },
  column: { flexDirection: "column" },
});

const align = stylex.create({
  start: { alignItems: "flex-start" },
  center: { alignItems: "center" },
  end: { alignItems: "flex-end" },
  baseline: { alignItems: "baseline" },
  stretch: { alignItems: "stretch" },
});

const justify = stylex.create({
  start: { justifyContent: "flex-start" },
  center: { justifyContent: "center" },
  end: { justifyContent: "flex-end" },
  between: { justifyContent: "space-between" },
});

const surface = stylex.create({
  "bg-1": { backgroundColor: background["bg-1"] },
  "bg-2": { backgroundColor: background["bg-2"] },
  contrast: { backgroundColor: background.contrast },
  brand: { backgroundColor: background.brand },
  transparent: { backgroundColor: background.transparent },
});

const corners = stylex.create({
  sm: { borderRadius: radius.sm },
  md: { borderRadius: radius.md },
});

const edge = stylex.create({
  default: {
    borderColor: border.default,
    borderStyle: "solid",
    borderWidth: 1,
  },
  strong: { borderColor: border.strong, borderStyle: "solid", borderWidth: 1 },
  brand: { borderColor: border.brand, borderStyle: "solid", borderWidth: 1 },
});

/* The closed set. Matching the list of raw elements a lint rule would ban, so
   banning them never costs a semantic tag. */
const ELEMENTS = [
  "div",
  "section",
  "nav",
  "main",
  "header",
  "footer",
  "article",
  "aside",
  "ul",
  "ol",
  "li",
  "span",
] as const;

type BoxElement = (typeof ELEMENTS)[number];

interface BoxOwnProps<T extends BoxElement> {
  alignItems?: keyof typeof align;
  as?: T;
  backgroundColor?: keyof typeof surface;
  borderColor?: keyof typeof edge;
  borderRadius?: keyof typeof corners;
  display?: keyof typeof layout;
  flexDirection?: keyof typeof direction;
  gap?: keyof typeof gaps;
  justifyContent?: keyof typeof justify;
  marginBottom?: keyof typeof marginBottom;
  marginTop?: keyof typeof marginTop;
  padding?: keyof typeof pad;
  style?: stylex.StyleXStyles;
}

type BoxProps<T extends BoxElement> = BoxOwnProps<T> &
  Omit<React.ComponentProps<T>, keyof BoxOwnProps<T>>;

export function Box<T extends BoxElement = "div">({
  as,
  display,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  padding,
  marginTop: mt,
  marginBottom: mb,
  backgroundColor,
  borderRadius,
  borderColor,
  style,
  ...rest
}: BoxProps<T>) {
  // The union of every allowed element's props widens `ref` past what any one
  // of them accepts, so the element is opaque to the JSX checker here. `as` is
  // still closed, and callers still get the right props for the tag they pass.
  const Element = (as ?? "div") as React.ElementType;

  return (
    <Element
      {...rest}
      {...stylex.props(
        display && layout[display],
        flexDirection && direction[flexDirection],
        alignItems && align[alignItems],
        justifyContent && justify[justifyContent],
        gap && gaps[gap],
        padding && pad[padding],
        mt && marginTop[mt],
        mb && marginBottom[mb],
        backgroundColor && surface[backgroundColor],
        borderRadius && corners[borderRadius],
        borderColor && edge[borderColor],
        style
      )}
    />
  );
}
