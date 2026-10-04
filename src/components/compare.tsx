import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";

import {
  colors,
  fontSizes,
  lineHeights,
  media,
  radii,
  shadows,
  space,
} from "~/styles/tokens.stylex";

const styles = stylex.create({
  compare: {
    backgroundColor: colors.fill,
    borderRadius: radii.md,
    boxShadow: shadows.card,
    display: "grid",
    gap: space.xxs,
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [media.sm]: "repeat(2, minmax(0, 1fr))",
    },
    padding: space.xxs,
  },
  side: {
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    boxShadow: shadows.card,
    display: "flex",
    flexDirection: "column",
  },
  label: {
    borderBlockEndColor: colors.fill,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: 1,
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.row,
    paddingBlock: space.xs,
    paddingInline: space.md,
  },
  body: {
    padding: space.md,
  },
});

function Compare({
  children,
  style,
}: {
  children?: ReactNode;
  style?: StyleXStyles;
}) {
  return <div {...stylex.props(styles.compare, style)}>{children}</div>;
}

function Before({ children }: { children?: ReactNode }) {
  return <Side name="Before">{children}</Side>;
}

function After({ children }: { children?: ReactNode }) {
  return <Side name="After">{children}</Side>;
}

function Side({ children, name }: { children?: ReactNode; name: string }) {
  return (
    <div {...stylex.props(styles.side)}>
      <p {...stylex.props(styles.label)}>{name}</p>
      <div {...stylex.props(styles.body)}>{children}</div>
    </div>
  );
}

export { After, Before, Compare };
