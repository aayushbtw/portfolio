import * as stylex from "@stylexjs/stylex";

import {
  List,
  ListItem,
  ListItemLink,
  ListItemTitle,
} from "~/components/ui/list";
import { Section } from "~/components/ui/page";
import type { Series } from "~/server/writings";
import { colors, fontSizes, space } from "~/styles/tokens.stylex";

// Rows share one leading column sized to its widest entry, so titles align.
const styles = stylex.create({
  list: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
  },
  row: {
    display: "grid",
    gap: space.md,
    gridColumn: "1 / -1",
    gridTemplateColumns: "subgrid",
  },
  lead: {
    fontSize: fontSizes.sm,
    fontVariantNumeric: "tabular-nums",
  },
  current: {
    backgroundColor: null,
    transform: null,
  },
  muted: {
    color: colors.textMuted,
  },
});

function SeriesParts({ series }: { series: Series }) {
  return (
    <Section
      title={`Part ${series.part} of ${series.parts.length} in ${series.title}`}
    >
      <List style={styles.list}>
        {series.parts.map(({ part, slug, title }) =>
          // An `a` without `href` is HTML's placeholder for the current page.
          part === series.part ? (
            <ListItem
              aria-current="page"
              key={slug}
              style={[styles.row, styles.current]}
            >
              <span {...stylex.props(styles.lead)}>{part}</span>
              <ListItemTitle>{title}</ListItemTitle>
            </ListItem>
          ) : (
            <ListItemLink
              key={slug}
              params={{ slug }}
              style={styles.row}
              to="/writings/$slug"
            >
              <span {...stylex.props(styles.lead)}>{part}</span>
              <ListItemTitle style={styles.muted}>{title}</ListItemTitle>
            </ListItemLink>
          )
        )}
      </List>
    </Section>
  );
}

function SeriesNav({ series }: { series: Series }) {
  return (
    <nav aria-label={`${series.title} series`}>
      <List style={styles.list}>
        {series.previous && (
          <SeriesLink label="Previous" part={series.previous} rel="prev" />
        )}
        {series.next && (
          <SeriesLink label="Next" part={series.next} rel="next" />
        )}
      </List>
    </nav>
  );
}

function SeriesLink({
  label,
  part,
  rel,
}: {
  label: string;
  part: Series["parts"][number];
  rel: "next" | "prev";
}) {
  return (
    <ListItemLink
      params={{ slug: part.slug }}
      rel={rel}
      style={styles.row}
      to="/writings/$slug"
    >
      <span {...stylex.props(styles.lead)}>{label}</span>
      <ListItemTitle>{part.title}</ListItemTitle>
    </ListItemLink>
  );
}

export { SeriesNav, SeriesParts };
