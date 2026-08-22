"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import { useMemo } from "react";
import { cn, formatNumber } from "~/lib/utils";
import { Skeleton } from "./skeleton";

/**
 * One handle shared by every cell. Base UI's detached-trigger pattern: each
 * `rect` is a `Tooltip.Trigger` carrying a payload, and a single `Tooltip.Root`
 * renders whichever one is active. Hover, open/close timing, anchoring and
 * repositioning between adjacent cells are all the library's problem now.
 *
 * The payload is the raw activity, not a formatted string: building the
 * sentence here would run `Intl` formatting 365 times per render instead of
 * once when the tooltip actually opens.
 */
const cellTooltip = Tooltip.createHandle<Activity>();

export interface Activity {
  count: number;
  date: string;
  level: number;
}

const BLOCK = 12;
const GAP = 2;
const CELL = BLOCK + GAP;
const RADIUS = 3;
/** Days in a week: the grid's height in cells, always. */
const ROWS = 7;
/** A year of weeks, for the skeleton, which has no data to count. */
const WEEKS = 53;

/**
 * Span of `n` cells in viewBox units. Cells are square, so this measures either
 * axis: the grid is `span(weeks)` wide and `span(ROWS)` tall. The `- GAP` drops
 * the trailing gap after the last cell, which has nothing to separate it from.
 */
function span(n: number) {
  return n * CELL - GAP;
}

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

const LEVELS = [
  "fill-graph-0",
  "fill-graph-1",
  "fill-graph-2",
  "fill-graph-3",
  "fill-graph-4",
];

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
  className,
  ...props
}: React.ComponentProps<"div"> & { data: Activity[]; total: number }) {
  const weeks = useMemo(() => toGrid(data), [data]);
  const months = useMemo(() => getMonthLabels(weeks), [weeks]);
  // The viewBox is a fixed coordinate system and the `svg` is `w-full`, so the
  // grid scales to whatever column it is dropped into rather than to a width
  // hard-coded here. It used to compute to exactly 740, which silently matched
  // the old `--container-content`; when that token moved to 644 the graph
  // started overflowing. Nothing reads the token now, which is the point: it
  // fits its parent, whatever that parent turns out to be.
  const width = span(weeks.length);

  if (data.length === 0) {
    return null;
  }

  return (
    // No delay either way: the graph is 365 targets in a small area and the
    // tooltip is the only way to read one, so a 600ms wait (Base UI's default)
    // makes the whole grid feel unresponsive.
    <Tooltip.Provider closeDelay={0} delay={0}>
      <div
        className={cn(
          "not-typeset flex w-full flex-col gap-xs text-fg-3",
          className
        )}
        data-slot="contribution-graph"
        {...props}
      >
        {/* Month labels are HTML, not `<text>` inside the svg. Anything in the
          svg scales with it, so at a 644px column they would render at 13px and
          fall off the type scale; out here they stay at the one size the site
          has, and position proportionally instead. */}
        <div className="relative h-5 w-full">
          {months.map(({ label, x }) => (
            <span
              className="absolute top-0 leading-none"
              key={x}
              style={{ left: `${(x / width) * 100}%` }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="w-full">
          <svg
            aria-hidden="true"
            className="block h-auto w-full overflow-visible"
            preserveAspectRatio="xMinYMin meet"
            viewBox={`0 0 ${width} ${span(ROWS)}`}
          >
            {weeks.map((week, wi) =>
              week.map((activity, di) => {
                if (!activity) {
                  return null;
                }

                return (
                  <Tooltip.Trigger
                    handle={cellTooltip}
                    key={activity.date}
                    payload={activity}
                    render={
                      <rect
                        className={LEVELS[activity.level]}
                        height={BLOCK}
                        // The block is `BLOCK` wide but hit-tests as the full
                        // `CELL`. A transparent stroke of `GAP` sits half in and
                        // half out, so it reaches exactly to the midpoint of the
                        // gutter on every side and neighbouring cells meet with
                        // nothing between them. `pointer-events="all"` is what
                        // makes an unpainted stroke count for hit testing; the
                        // default only tests what is visibly painted.
                        pointerEvents="all"
                        rx={RADIUS}
                        ry={RADIUS}
                        stroke="transparent"
                        strokeWidth={GAP}
                        width={BLOCK}
                        x={CELL * wi}
                        y={CELL * di}
                      />
                    }
                  />
                );
              })
            )}
          </svg>
        </div>

        <Tooltip.Root handle={cellTooltip}>
          {({ payload }) => (
            <Tooltip.Portal>
              <Tooltip.Positioner
                className="isolate z-50"
                side="top"
                sideOffset={4}
              >
                <Tooltip.Popup className="rounded-md bg-fg-1 px-sm py-xs text-bg-1">
                  {payload
                    ? `${payload.count > 0 ? payload.count : "No"} contributions on ${formatDate(payload.date)}`
                    : null}
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          )}
        </Tooltip.Root>

        <p>{formatNumber(total)} contributions in the last year</p>
      </div>
    </Tooltip.Provider>
  );
}

// Reserves the graph's exact height so the shell does not shift when the
// contributions land.
function ContributionGraphSkeleton() {
  return (
    <div className="flex max-w-full flex-col gap-xs">
      {/* The grid scales with its column, so its height is a ratio rather than
          a number. `h-5` matches the month label row above it. */}
      <div className="h-5" />
      <Skeleton
        className="w-full"
        style={{ aspectRatio: `${span(WEEKS)} / ${span(ROWS)}` }}
      />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}

export { ContributionGraph, ContributionGraphSkeleton };
