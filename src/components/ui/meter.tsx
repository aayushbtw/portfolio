import * as stylex from "@stylexjs/stylex";
import { Box } from "~/components/primitives/box";
import { Text } from "~/components/primitives/text";
import { background } from "~/styles/tokens/color.stylex";

/* Four steps down from the brand colour. A segment names its rank, not its
   shade: rank 0 is the most-used model of the year and keeps that step on
   every bar, so the same model reads the same everywhere. Previously these
   were Tailwind class strings passed through the data. */
const SHADE_COUNT = 4;

type MeterShade = 0 | 1 | 2 | 3;

interface MeterSegment {
  label: string;
  /** Rank in the shared ordering, 0 being the most used. */
  shade: MeterShade;
  /** Percentage of the bar's own filled width, not of the track. */
  share: number;
}

const shades = stylex.create({
  0: { opacity: 0.8 },
  1: { opacity: 0.6 },
  2: { opacity: 0.35 },
  3: { opacity: 0.2 },
});

const styles = stylex.create({
  track: {
    height: "0.375rem",
    overflow: "hidden",
    borderRadius: "9999px",
    backgroundColor: background["bg-2"],
  },
  /* `gap: 1px` is off the spacing scale on purpose: it is a hairline that keeps
     two adjacent shades from reading as one segment, tuned to the bar rather
     than to a step. Same exemption as an optical nudge. */
  fill: {
    display: "flex",
    height: "100%",
    gap: "1px",
    overflow: "hidden",
    borderRadius: "9999px",
  },
  fillWidth: (pct: number) => ({ width: `${pct}%` }),
  segment: {
    backgroundImage: `linear-gradient(to bottom, ${background.brand}, color-mix(in oklch, ${background.brand} 60%, transparent))`,
  },
  segmentWidth: (pct: number) => ({ width: `${pct}%` }),
  legend: { display: "flex", flexWrap: "wrap", columnGap: "1rem" },
  swatch: {
    height: "0.5rem",
    width: "2px",
    flexShrink: 0,
    borderRadius: "9999px",
  },
});

/**
 * One horizontal bar, filled to `value` percent of the track and split into
 * segments that divide that fill.
 *
 * Every bar in a group must be given its `value` on one shared scale, or the
 * lengths compare things that aren't comparable. The bar carries no text: it
 * is `aria-hidden` because `MeterLegend` states the same numbers in words, and
 * two announcements of one fact is worse than none.
 */
function Meter({
  segments,
  value,
}: {
  segments: MeterSegment[];
  value: number;
}) {
  return (
    <Box aria-hidden="true" style={styles.track}>
      <Box style={[styles.fill, styles.fillWidth(value)]}>
        {segments.map((segment) => (
          <Box
            key={segment.label}
            style={[
              styles.segment,
              shades[segment.shade],
              styles.segmentWidth(segment.share),
            ]}
          />
        ))}
      </Box>
    </Box>
  );
}

/** Direct labels for a `Meter`, which is why the bar itself needs no legend. */
function MeterLegend({ segments }: { segments: MeterSegment[] }) {
  return (
    <Box style={styles.legend}>
      {segments.map((segment) => (
        <Box alignItems="center" display="flex" gap="xs" key={segment.label}>
          <Box
            aria-hidden="true"
            style={[styles.swatch, styles.segment, shades[segment.shade]]}
          />
          <Text as="span" numeric="tabular" variant="label">
            {segment.label} {segment.share}%
          </Text>
        </Box>
      ))}
    </Box>
  );
}

export { Meter, MeterLegend, type MeterSegment, type MeterShade, SHADE_COUNT };
