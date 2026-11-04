import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";

import type { SeriesPosition } from "~/server/writings";
import {
  colors,
  durations,
  easings,
  fontSizes,
  lineHeights,
  media,
  presses,
  shadows,
  space,
} from "~/styles/tokens.stylex";

const styles = stylex.create({
  partLink: {
    color: "inherit",
    textDecorationColor: {
      default: colors.edgeStrong,
      [media.hover]: {
        default: colors.edgeStrong,
        ":hover": colors.textMuted,
      },
    },
    textDecorationLine: "underline",
    textUnderlineOffset: 3,
    transitionDuration: durations.hover,
    transitionProperty: "text-decoration-color",
    transitionTimingFunction: "ease",
  },
  nav: {
    boxShadow: shadows.ruleTop,
    columnGap: space.md,
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [media.sm]: "repeat(2, minmax(0, 1fr))",
    },
    marginBlockStart: space.xl,
    paddingBlockStart: space.lg,
    rowGap: space.lg,
  },
  cell: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    textDecoration: "none",
    transform: { default: null, ":active": presses.link },
    transitionDuration: durations.press,
    transitionProperty: "transform",
    transitionTimingFunction: easings.out,
  },
  next: {
    alignItems: "flex-end",
    gridColumn: { default: null, [media.sm]: 2 },
    textAlign: "end",
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.row,
  },
  title: {
    color: {
      default: colors.textSecondary,
      [media.hover]: {
        default: colors.textSecondary,
        [stylex.when.ancestor(":hover")]: colors.textPrimary,
      },
    },
    lineHeight: lineHeights.prose,
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
  },
});

function SeriesPartLink({ series }: { series: SeriesPosition }) {
  return (
    <Link
      params={{ slug: series.slug }}
      to="/series/$slug"
      {...stylex.props(styles.partLink)}
    >
      Part {series.part} of {series.parts.length} in {series.title}
    </Link>
  );
}

function SeriesNav({ series }: { series: SeriesPosition }) {
  return (
    <nav aria-label={`${series.title} series`} {...stylex.props(styles.nav)}>
      {series.previous && (
        <SeriesNavLink label="Previous" part={series.previous} rel="prev" />
      )}
      {series.next && (
        <SeriesNavLink label="Next" part={series.next} rel="next" />
      )}
    </nav>
  );
}

function SeriesNavLink({
  label,
  part,
  rel,
}: {
  label: string;
  part: SeriesPosition["parts"][number];
  rel: "next" | "prev";
}) {
  return (
    <Link
      params={{ slug: part.slug }}
      rel={rel}
      to="/writings/$slug"
      {...stylex.props(
        stylex.defaultMarker(),
        styles.cell,
        rel === "next" && styles.next
      )}
    >
      <span {...stylex.props(styles.label)}>{label}</span>
      <span {...stylex.props(styles.title)}>{part.title}</span>
    </Link>
  );
}

export { SeriesNav, SeriesPartLink };
