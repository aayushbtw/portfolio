import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { colors, radii } from "~/styles/tokens.stylex";

const pulse = stylex.keyframes({
  "50%": { opacity: 0.5 },
});

const styles = stylex.create({
  skeleton: {
    animationDuration: "2s",
    animationIterationCount: "infinite",
    animationName: pulse,
    animationTimingFunction: "ease-in-out",
    backgroundColor: colors.fill,
    borderRadius: radii.xs,
  },
});

function Skeleton({ style }: { style?: StyleXStyles }) {
  return <div {...stylex.props(styles.skeleton, style)} />;
}

export { Skeleton };
