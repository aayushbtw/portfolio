import * as stylex from "@stylexjs/stylex";

import {
  List,
  ListItem,
  ListItemLeader,
  ListItemLink,
  ListItemMeta,
  ListItemTitle,
} from "~/components/ui/list";
import { Section } from "~/components/ui/page";
import type { Series } from "~/server/writings";
import { colors, fontSizes, space } from "~/styles/tokens.stylex";

const styles = stylex.create({
  row: {
    display: "grid",
    gap: space.md,
    gridTemplateColumns: "56px minmax(0, 1fr)",
  },
  figure: {
    fontSize: fontSizes.sm,
    fontVariantNumeric: "tabular-nums",
  },
  current: {
    backgroundColor: colors.fill,
    transform: null,
  },
});

function SeriesParts({ series }: { series: Series }) {
  return (
    <Section
      title={`Part ${series.part} of ${series.parts.length} in ${series.title}`}
    >
      <List>
        {series.parts.map(({ part, slug, title }) => {
          const row = (
            <>
              <span {...stylex.props(styles.figure)}>{part}</span>
              <ListItemTitle>{title}</ListItemTitle>
            </>
          );

          // An `a` without `href` is HTML's placeholder for the current page.
          return part === series.part ? (
            <ListItem
              aria-current="page"
              key={slug}
              style={[styles.row, styles.current]}
            >
              {row}
            </ListItem>
          ) : (
            <ListItemLink
              key={slug}
              params={{ slug }}
              style={styles.row}
              to="/writings/$slug"
            >
              {row}
            </ListItemLink>
          );
        })}
      </List>
    </Section>
  );
}

function SeriesNav({ series }: { series: Series }) {
  return (
    <nav aria-label={`${series.title} series`}>
      <List>
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
    <ListItemLink params={{ slug: part.slug }} rel={rel} to="/writings/$slug">
      <ListItemTitle>{part.title}</ListItemTitle>
      <ListItemLeader />
      <ListItemMeta>{label}</ListItemMeta>
    </ListItemLink>
  );
}

export { SeriesNav, SeriesParts };
