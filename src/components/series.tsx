import { StackIcon } from "@phosphor-icons/react/Stack";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";

import { List, ListItemLink } from "~/components/ui/list";
import type { SeriesPosition } from "~/server/writings";
import {
  colors,
  durations,
  easings,
  fontSizes,
  lineHeights,
  media,
  presses,
  radii,
  shadows,
  space,
} from "~/styles/tokens.stylex";

const styles = stylex.create({
  part: (digits: number) => ({
    alignItems: "baseline",
    // A pill radius bulges on a row that wraps to several lines.
    borderRadius: radii.md,
    columnGap: space.sm,
    display: "grid",
    gridTemplateColumns: `${digits}ch minmax(0, 1fr)`,
    paddingBlock: space.sm,
  }),
  partNumber: {
    fontSize: fontSizes.sm,
    fontVariantNumeric: "tabular-nums",
  },
  partText: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
  },
  partTitle: {
    color: colors.textPrimary,
  },
  partDescription: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.prose,
  },
  mark: {
    alignItems: "center",
    display: "flex",
    gap: space.xxs,
  },
  partLink: {
    color: "inherit",
    textDecoration: "none",
  },
  partLabel: {
    textDecorationColor: {
      default: colors.edgeStrong,
      [media.hover]: {
        default: colors.edgeStrong,
        [stylex.when.ancestor(":hover")]: colors.textMuted,
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

function SeriesMark({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleXStyles;
}) {
  return (
    <span {...stylex.props(styles.mark, style)}>
      <StackIcon aria-hidden="true" size="1em" />
      {children}
    </span>
  );
}

function SeriesPartLink({ series }: { series: SeriesPosition }) {
  return (
    <Link
      aria-label={`Part ${series.part} of ${series.parts.length} in ${series.title}`}
      params={{ slug: series.slug }}
      to="/writings/$slug"
      {...stylex.props(stylex.defaultMarker(), styles.partLink)}
    >
      <SeriesMark>
        <span {...stylex.props(styles.partLabel)}>
          {`${series.part} / ${series.parts.length} in ${series.title}`}
        </span>
      </SeriesMark>
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

function SeriesParts({ parts }: { parts: SeriesPosition["parts"] }) {
  const digits = String(parts.length).length;

  return (
    <List>
      {parts.map((part) => (
        <ListItemLink
          key={part.slug}
          params={{ slug: part.slug }}
          style={styles.part(digits)}
          to="/writings/$slug"
        >
          <span {...stylex.props(styles.partNumber)}>{part.part}</span>
          <span {...stylex.props(styles.partText)}>
            <span {...stylex.props(styles.partTitle)}>{part.title}</span>
            <span {...stylex.props(styles.partDescription)}>
              {part.description}
            </span>
          </span>
        </ListItemLink>
      ))}
    </List>
  );
}

export { SeriesMark, SeriesNav, SeriesPartLink, SeriesParts };
