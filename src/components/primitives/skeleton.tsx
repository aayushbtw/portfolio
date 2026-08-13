import * as stylex from "@stylexjs/stylex";
import { background } from "~/styles/tokens/color.stylex";
import { radius } from "~/styles/tokens/layout.stylex";

const pulse = stylex.keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.5 },
});

const styles = stylex.create({
  base: {
    backgroundColor: background["bg-2"],
    borderRadius: radius.sm,
    animationName: pulse,
    animationDuration: "2s",
    animationTimingFunction: "cubic-bezier(0.4, 0, 0.6, 1)",
    animationIterationCount: "infinite",
  },
});

interface SkeletonProps {
  // Size is the caller's, because a placeholder only works when it is the shape
  // of the thing it stands in for. Pass a local `stylex.create` style.
  style?: stylex.StyleXStyles;
}

export function Skeleton({ style }: SkeletonProps) {
  return <div data-slot="skeleton" {...stylex.props(styles.base, style)} />;
}
