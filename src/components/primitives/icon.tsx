import * as stylex from "@stylexjs/stylex";
import { foreground } from "~/styles/tokens/color.stylex";
import { iconSize } from "~/styles/tokens/layout.stylex";

const sizes = stylex.create({
  sm: { width: iconSize.sm, height: iconSize.sm },
  md: { width: iconSize.md, height: iconSize.md },
});

const tone = stylex.create({
  "fg-1": { color: foreground["fg-1"] },
  "fg-2": { color: foreground["fg-2"] },
  "fg-3": { color: foreground["fg-3"] },
  contrast: { color: foreground.contrast },
  brand: { color: foreground.brand },
  inherit: { color: foreground.inherit },
});

const base = stylex.create({
  block: { display: "inline-block", flexShrink: 0 },
});

interface IconProps {
  as: React.ComponentType<React.ComponentProps<"svg">>;
  color?: keyof typeof tone;
  // Icons are decorative wherever they sit beside the text that names them.
  // Passing a label makes the icon the accessible name instead.
  label?: string;
  size?: keyof typeof sizes;
  style?: stylex.StyleXStyles;
}

export function Icon({ as: Svg, size = "md", color, style, label }: IconProps) {
  return (
    <Svg
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
      role={label ? "img" : undefined}
      {...stylex.props(base.block, sizes[size], color && tone[color], style)}
    />
  );
}
