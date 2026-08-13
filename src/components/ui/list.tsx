import * as stylex from "@stylexjs/stylex";
import { Box } from "~/components/primitives/box";
import { Skeleton } from "~/components/primitives/skeleton";
import type { StyleProp } from "~/components/primitives/style-prop";
import { rowMarker } from "~/styles/markers.stylex";
import { background, foreground } from "~/styles/tokens/color.stylex";
import { spacing } from "~/styles/tokens/layout.stylex";

const styles = stylex.create({
  row: {
    transitionProperty: "background-color, scale",
    transitionDuration: "150ms",
    backgroundColor: {
      default: background.transparent,
      ":hover": background["bg-2"],
    },
    scale: {
      default: "1",
      ":active": "0.98",
    },
  },
  /* The list sits inside `.typeset`, where every anchor is given an underline
     and `font-medium`. A row is a target, not a link in a sentence, so it takes
     neither. This replaces the `[&_a]:no-underline` descendant selector. */
  link: {
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    textDecorationLine: "none",
    color: foreground["fg-3"],
  },
  /* Hidden until the row it belongs to is hovered. */
  revealed: {
    opacity: {
      default: 0,
      [stylex.when.ancestor(":hover", rowMarker)]: 1,
    },
    transitionProperty: "opacity",
    transitionDuration: "150ms",
  },
});

/* Rows are their own typographic context, so `data-not-typeset` keeps
   typeset.css from putting discs and indents on the `ul`. It is a scoping
   declaration rather than a style, and it goes when typeset is narrowed to
   rendered markdown. */
function List({ children }: { children: React.ReactNode }) {
  return (
    <Box as="ul" data-not-typeset marginTop="sm">
      {children}
    </Box>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="li"
      bleed="md"
      borderRadius="md"
      marker={rowMarker}
      paddingBlock="sm"
      style={styles.row}
    >
      {children}
    </Box>
  );
}

/* The trailing cluster on a row: counts, dates, the arrow. */
function ListItemHover({ children }: { children: React.ReactNode }) {
  return (
    <Box
      alignItems="center"
      display="flex"
      gap="md"
      marginInlineStart="auto"
      style={styles.revealed}
    >
      {children}
    </Box>
  );
}

function ListSkeleton({
  rows,
  rowStyle,
}: {
  rows: number;
  rowStyle?: StyleProp;
}) {
  return (
    <List>
      {/* Same box as `ListItem` minus the hover, so nothing shifts when the
          real rows land. A placeholder that isn't the shape of the thing it
          stands in for is worse than no placeholder. */}
      {Array.from({ length: rows }, (_, i) => `row-${i}`).map((key) => (
        <Box as="li" bleed="md" key={key} paddingBlock="sm">
          <Skeleton style={[skeletonSizes.fullWidth, rowStyle]} />
        </Box>
      ))}
    </List>
  );
}

const skeletonSizes = stylex.create({
  fullWidth: { width: "100%", height: "1.25rem" },
});

export { List, ListItem, ListItemHover, ListSkeleton, styles as listStyles };
