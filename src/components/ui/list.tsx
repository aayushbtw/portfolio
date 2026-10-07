import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createLink } from "@tanstack/react-router";

import {
  colors,
  durations,
  easings,
  fontSizes,
  lineHeights,
  media,
  presses,
  radii,
  space,
} from "~/styles/tokens.stylex";

type Props<T extends keyof React.JSX.IntrinsicElements> = Omit<
  React.ComponentProps<T>,
  "className" | "style"
> & { style?: StyleXStyles };

const styles = stylex.create({
  list: {
    color: colors.textMuted,
    lineHeight: lineHeights.row,
    marginInline: `calc(-1 * ${space.md})`,
  },
  item: {
    alignItems: "center",
    backgroundColor: {
      default: null,
      [media.hover]: { default: null, ":hover": colors.fill },
    },
    borderRadius: radii.full,
    display: "flex",
    gap: space.xs,
    paddingBlock: space.xs,
    paddingInline: space.md,
    textDecoration: "none",
    transform: { default: null, ":active": presses.row },
    transitionDuration: `${durations.hover}, ${durations.press}`,
    transitionProperty: "background-color, transform",
    transitionTimingFunction: `ease, ${easings.out}`,
  },
  title: {
    color: colors.textPrimary,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  leader: {
    backgroundColor: {
      default: colors.fill,
      [media.hover]: {
        default: colors.fill,
        [stylex.when.ancestor(":hover")]: colors.fillStrong,
      },
    },
    flexGrow: 1,
    height: 1,
    minWidth: space.md,
    transitionDuration: durations.hover,
    transitionProperty: "background-color",
    transitionTimingFunction: "ease",
  },
  meta: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    fontSize: fontSizes.sm,
    gap: space.xxs,
  },
  hover: {
    alignItems: "center",
    display: "flex",
    marginInlineStart: "auto",
    opacity: {
      default: 1,
      [media.hover]: {
        default: 0,
        [stylex.when.ancestor(":hover")]: 1,
      },
    },
    transitionDuration: durations.hover,
    transitionProperty: "opacity",
    transitionTimingFunction: "ease",
  },
});

function List({ style, ...props }: Props<"div">) {
  return <div {...props} {...stylex.props(styles.list, style)} />;
}

function ListItem({ children, style, ...props }: Props<"a">) {
  return (
    <a {...props} {...stylex.props(stylex.defaultMarker(), styles.item, style)}>
      {children}
    </a>
  );
}

const ListItemLink = createLink(ListItem);

function ListItemTitle({ style, ...props }: Props<"span">) {
  return <span {...props} {...stylex.props(styles.title, style)} />;
}

function ListItemLeader() {
  return <span aria-hidden="true" {...stylex.props(styles.leader)} />;
}

function ListItemMeta({ style, ...props }: Props<"span">) {
  return <span {...props} {...stylex.props(styles.meta, style)} />;
}

function ListItemHover({ style, ...props }: Props<"div">) {
  return <div {...props} {...stylex.props(styles.hover, style)} />;
}

export {
  List,
  ListItem,
  ListItemHover,
  ListItemLeader,
  ListItemLink,
  ListItemMeta,
  ListItemTitle,
};
