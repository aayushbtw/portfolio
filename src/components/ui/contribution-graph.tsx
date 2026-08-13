"use client";

import * as stylex from "@stylexjs/stylex";
import { lazy, Suspense, useCallback, useMemo, useRef, useState } from "react";
import { Box } from "~/components/primitives/box";
import { Skeleton } from "~/components/primitives/skeleton";
import { Text } from "~/components/primitives/text";
import { formatNumber } from "~/lib/utils";
import { foreground, graph } from "~/styles/tokens/color.stylex";
import {
  fontSize,
  letterSpacing,
  lineHeight,
} from "~/styles/tokens/typography.stylex";

// Base UI's tooltip is the heaviest thing on the page and only matters once a
// cell is hovered, so it loads on the first pointer entering the graph.
const ContributionTooltip = lazy(() =>
  import("./contribution-tooltip").then((m) => ({
    default: m.ContributionTooltip,
  }))
);

export interface Activity {
  count: number;
  date: string;
  level: number;
}

const BLOCK = 12;
const GAP = 2;
const CELL = BLOCK + GAP;
const RADIUS = 3;
const LABEL_H = 22;

const shortMonth = new Intl.DateTimeFormat("en", {
  month: "short",
  timeZone: "UTC",
});

const longMonth = new Intl.DateTimeFormat("en", {
  month: "long",
  timeZone: "UTC",
});

// "1st", "2nd", "3rd", "4th". `Intl.PluralRules` knows which suffix a number
// takes; hand-rolling it means rediscovering that 11 through 13 are exceptions.
const ordinalRules = new Intl.PluralRules("en", { type: "ordinal" });

const ORDINAL_SUFFIX: Record<Intl.LDMLPluralRule, string> = {
  few: "rd",
  many: "th",
  one: "st",
  other: "th",
  two: "nd",
  zero: "th",
};

const levels = stylex.create({
  0: { fill: graph[0] },
  1: { fill: graph[1] },
  2: { fill: graph[2] },
  3: { fill: graph[3] },
  4: { fill: graph[4] },
});

const styles = stylex.create({
  /* The month labels are `<text>` inside the SVG and inherit both of these, so
     the frame carries the label treatment rather than each label repeating it. */
  frame: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.xs,
    color: foreground["fg-3"],
  },
  svg: { display: "block", overflow: "visible" },
  labels: { fill: "currentColor" },
  graphPlaceholder: (height: number) => ({ width: "100%", height }),
  captionPlaceholder: { width: "16rem", height: "1rem" },
});

// The grid is built from calendar days, so every field is read in UTC. Reading
// them locally would shift the whole grid by a day west of Greenwich, and the
// graph is rendered on the server and hydrated on the client.
function parseDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

function formatDate(date: string): string {
  const d = parseDate(date);
  const day = d.getUTCDate();

  return `${day}${ORDINAL_SUFFIX[ordinalRules.select(day)]} ${longMonth.format(d)}`;
}

function toGrid(data: Activity[]): (Activity | undefined)[][] {
  if (data.length === 0) {
    return [];
  }

  const sorted = data.toSorted((a, b) => a.date.localeCompare(b.date));
  const firstDay = parseDate(sorted[0].date).getUTCDay();
  const padded: (Activity | undefined)[] = [
    ...new Array<undefined>(firstDay),
    ...sorted,
  ];

  const weeks: (Activity | undefined)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  return weeks;
}

function getMonthLabels(
  weeks: (Activity | undefined)[][]
): { label: string; x: number }[] {
  const labels: { label: string; x: number }[] = [];
  let lastKey = "";

  for (let i = 0; i < weeks.length; i++) {
    const first = weeks[i].find(Boolean);
    if (!first) {
      continue;
    }

    const d = parseDate(first.date);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;

    if (key !== lastKey) {
      labels.push({ label: shortMonth.format(d), x: CELL * i });
      lastKey = key;
    }
  }

  return labels.filter((l, i, arr) => {
    if (i === 0) {
      return !arr[1] || arr[1].x - l.x >= CELL * 3;
    }
    if (i === arr.length - 1) {
      return CELL * weeks.length - l.x >= CELL * 3;
    }
    return true;
  });
}

function ContributionGraph({
  data,
  total,
}: {
  data: Activity[];
  total: number;
}) {
  const weeks = useMemo(() => toGrid(data), [data]);
  const months = useMemo(() => getMonthLabels(weeks), [weeks]);
  const width = weeks.length * CELL - GAP;
  const height = LABEL_H + 7 * CELL - GAP;

  const anchorRef = useRef<SVGRectElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [open, setOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState("");

  const arm = useCallback(() => setArmed(true), []);

  const onPointerEnter = useCallback(
    (e: React.PointerEvent<SVGRectElement>) => {
      const date = e.currentTarget.dataset.date;
      if (!date) {
        return;
      }
      const count = Number(e.currentTarget.dataset.count);
      anchorRef.current = e.currentTarget;
      setTooltipText(
        `${count > 0 ? count : "No"} contributions on ${formatDate(date)}`
      );
      setOpen(true);
    },
    []
  );

  const onPointerLeave = useCallback(() => {
    setOpen(false);
  }, []);

  if (data.length === 0) {
    return null;
  }

  return (
    <Box
      data-not-typeset
      data-slot="contribution-graph"
      display="flex"
      flexDirection="column"
      gap="xs"
      maxWidth="full"
      onPointerEnter={arm}
      style={styles.frame}
      width="max"
    >
      <Box maxWidth="full" overflowX="auto" overflowY="hidden">
        <svg
          aria-hidden="true"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          {...stylex.props(styles.svg)}
        >
          <g {...stylex.props(styles.labels)}>
            {months.map(({ label, x }) => (
              <text dominantBaseline="hanging" key={x} x={x}>
                {label}
              </text>
            ))}
          </g>
          {weeks.map((week, wi) =>
            week.map((activity, di) => {
              if (!activity) {
                return null;
              }

              return (
                <rect
                  {...stylex.props(
                    levels[activity.level as keyof typeof levels]
                  )}
                  data-count={activity.count}
                  data-date={activity.date}
                  height={BLOCK}
                  key={activity.date}
                  onPointerEnter={onPointerEnter}
                  onPointerLeave={onPointerLeave}
                  rx={RADIUS}
                  ry={RADIUS}
                  width={BLOCK}
                  x={CELL * wi}
                  y={LABEL_H + CELL * di}
                />
              );
            })
          )}
        </svg>
      </Box>

      {armed && (
        <Suspense fallback={null}>
          <ContributionTooltip
            anchor={anchorRef}
            open={open}
            text={tooltipText}
          />
        </Suspense>
      )}

      <Text variant="label">
        {formatNumber(total)} contributions in the last year
      </Text>
    </Box>
  );
}

// Reserves the graph's exact height so the shell does not shift when the
// contributions land.
function ContributionGraphSkeleton() {
  return (
    <Box display="flex" flexDirection="column" gap="xs" maxWidth="full">
      <Skeleton style={styles.graphPlaceholder(LABEL_H + 7 * CELL - GAP)} />
      <Skeleton style={styles.captionPlaceholder} />
    </Box>
  );
}

export { ContributionGraph, ContributionGraphSkeleton };
