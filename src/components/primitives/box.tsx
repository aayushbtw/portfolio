import * as stylex from "@stylexjs/stylex";
import { breakpoint } from "~/styles/breakpoints.stylex";
import { background, border } from "~/styles/tokens/color.stylex";
import { radius } from "~/styles/tokens/layout.stylex";
import {
  bleedInline,
  gaps,
  marginBottom,
  marginTop,
  pad,
  padBlock,
  padBottom,
  padInline,
} from "./scales";
import type { Marker, StyleProp } from "./style-prop";

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

const sizing = stylex.create({
  full: { width: "100%" },
  max: { width: "max-content" },
  auto: { width: "auto" },
});

const capWidth = stylex.create({
  full: { maxWidth: "100%" },
  none: { maxWidth: "none" },
});

/* `min-width: 0` is the fix for a flex child that refuses to shrink below its
   content. It is a layout escape, not a size, so it is a boolean. */
const shrinkable = stylex.create({
  on: { minWidth: 0 },
});

const flexing = stylex.create({
  "1": { flexGrow: 1, flexShrink: 1, flexBasis: "0%" },
  auto: { flexGrow: 1, flexShrink: 1, flexBasis: "auto" },
  none: { flexGrow: 0, flexShrink: 0, flexBasis: "auto" },
});

const scrollX = stylex.create({
  auto: { overflowX: "auto" },
  hidden: { overflowX: "hidden" },
  visible: { overflowX: "visible" },
});

const scrollY = stylex.create({
  auto: { overflowY: "auto" },
  hidden: { overflowY: "hidden" },
  visible: { overflowY: "visible" },
});

const placement = stylex.create({
  relative: { position: "relative" },
  absolute: { position: "absolute" },
  fixed: { position: "fixed" },
  static: { position: "static" },
});

/* `auto` only. A start margin with a length is spacing and belongs on the
   parent's `gap`; `auto` is the one case that means "push me to the end". */
const startMargin = stylex.create({
  auto: { marginInlineStart: "auto" },
});

const surface = stylex.create({
  "bg-1": { backgroundColor: background["bg-1"] },
  "bg-2": { backgroundColor: background["bg-2"] },
  "bg-2-soft": { backgroundColor: background["bg-2-soft"] },
  "bg-1-veil": { backgroundColor: background["bg-1-veil"] },
  contrast: { backgroundColor: background.contrast },
  brand: { backgroundColor: background.brand },
  transparent: { backgroundColor: background.transparent },
});

const corners = stylex.create({
  sm: { borderRadius: radius.sm },
  md: { borderRadius: radius.md },
  full: { borderRadius: "9999px" },
});

/* Column counts, not templates. `2` means "two columns once there is room for
   them, one below", because every split on this site collapses at the same
   width and the collapse is part of the decision, not a separate one. */
const columnCount = stylex.create({
  1: { gridTemplateColumns: "repeat(1, minmax(0, 1fr))" },
  2: {
    gridTemplateColumns: {
      default: "repeat(1, minmax(0, 1fr))",
      [breakpoint.md]: "repeat(2, minmax(0, 1fr))",
    },
  },
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
  "figure",
  // A button is a box you can press and an anchor is a box you can follow.
  // Both are in the set so a pressable surface never needs a raw element to
  // get its layout props.
  "button",
  "a",
] as const;

type BoxElement = (typeof ELEMENTS)[number];

interface BoxOwnProps<T extends BoxElement> {
  alignItems?: keyof typeof align;
  as?: T;
  backgroundColor?: keyof typeof surface;
  bleed?: keyof typeof bleedInline;
  borderColor?: keyof typeof edge;
  borderRadius?: keyof typeof corners;
  columns?: keyof typeof columnCount;
  display?: keyof typeof layout;
  flex?: keyof typeof flexing;
  flexDirection?: keyof typeof direction;
  gap?: keyof typeof gaps;
  justifyContent?: keyof typeof justify;
  marginBottom?: keyof typeof marginBottom;
  marginInlineStart?: keyof typeof startMargin;
  marginTop?: keyof typeof marginTop;
  marker?: Marker;
  maxWidth?: keyof typeof capWidth;
  overflowX?: keyof typeof scrollX;
  overflowY?: keyof typeof scrollY;
  padding?: keyof typeof pad;
  paddingBlock?: keyof typeof padBlock;
  paddingBottom?: keyof typeof padBottom;
  paddingInline?: keyof typeof padInline;
  position?: keyof typeof placement;
  shrink?: boolean;
  style?: StyleProp;
  width?: keyof typeof sizing;
}

/* `className` is omitted, not merged. A class string is the open surface this
   whole system exists to close: it would let any value in and, because
   `stylex.props` writes the element's class last, it would be silently dropped
   anyway. Failing to compile is the honest answer. */
type BoxProps<T extends BoxElement> = BoxOwnProps<T> &
  Omit<React.ComponentProps<T>, keyof BoxOwnProps<T> | "className">;

export function Box<T extends BoxElement = "div">({
  as,
  display,
  columns,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  padding,
  paddingInline,
  paddingBlock,
  paddingBottom,
  bleed,
  marginTop: mt,
  marginBottom: mb,
  marginInlineStart: ms,
  width,
  maxWidth,
  shrink,
  flex,
  overflowX,
  overflowY,
  position,
  backgroundColor,
  borderRadius,
  borderColor,
  marker,
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
        columns && columnCount[columns],
        flexDirection && direction[flexDirection],
        alignItems && align[alignItems],
        justifyContent && justify[justifyContent],
        gap && gaps[gap],
        padding && pad[padding],
        paddingInline && padInline[paddingInline],
        paddingBlock && padBlock[paddingBlock],
        paddingBottom && padBottom[paddingBottom],
        bleed && bleedInline[bleed],
        mt && marginTop[mt],
        mb && marginBottom[mb],
        ms && startMargin[ms],
        width && sizing[width],
        maxWidth && capWidth[maxWidth],
        shrink && shrinkable.on,
        flex && flexing[flex],
        overflowX && scrollX[overflowX],
        overflowY && scrollY[overflowY],
        position && placement[position],
        backgroundColor && surface[backgroundColor],
        borderRadius && corners[borderRadius],
        borderColor && edge[borderColor],
        marker,
        style
      )}
    />
  );
}
