"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import { useMemo } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn, formatNumber } from "~/lib/utils";

/**
 * One handle shared by every cell, so a single `Tooltip.Root` renders whichever
 * trigger is active. The payload stays raw: formatting it here would run `Intl`
 * once per cell per render instead of once when the tooltip opens.
 */
const cellTooltip = Tooltip.createHandle<Activity>();

interface Activity {
  count: number;
  date: string;
  level: number;
}

const BLOCK = 12;
const GAP = 2;
const CELL = BLOCK + GAP;
const RADIUS = 3;
const ROWS = 7;
/** A year of weeks, for the skeleton, which has no data to count. */
const WEEKS = 53;

/** Span of `n` cells in viewBox units, minus the trailing gap after the last. */
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

// Hand-rolling the suffix means rediscovering that 11 through 13 are exceptions.
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

// Every field is read in UTC: the graph renders on the server and hydrates on
// the client, and local time would shift the grid a day west of Greenwich.
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
  const width = span(weeks.length);

  if (data.length === 0) {
    return null;
  }

  return (
    // Base UI's default delay feels unresponsive across a grid this dense.
    <Tooltip.Provider closeDelay={0} delay={0}>
      <div
        className={cn(
          "not-typeset flex w-full flex-col gap-xs text-fg-3",
          className
        )}
        data-slot="contribution-graph"
        {...props}
      >
        {/* Labels are HTML, not `<text>`: anything inside the svg scales with
          it and falls off the type scale. Out here they hold one size and
          position proportionally. */}
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
                        // A transparent `GAP` stroke straddles the gutter so
                        // cells hit-test as a full `CELL` with no dead space
                        // between them. `all` is what makes an unpainted stroke
                        // count for hit testing.
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

        <p className="text-sm">
          {formatNumber(total)} contributions in the last year
        </p>
      </div>
    </Tooltip.Provider>
  );
}

// Reserves the graph's exact height so nothing shifts when the data lands.
function ContributionGraphSkeleton() {
  return (
    <div className="flex max-w-full flex-col gap-xs">
      {/* Matches the month label row. */}
      <div className="h-5" />
      <Skeleton
        className="w-full"
        style={{ aspectRatio: `${span(WEEKS)} / ${span(ROWS)}` }}
      />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}

export { type Activity, ContributionGraph, ContributionGraphSkeleton };
