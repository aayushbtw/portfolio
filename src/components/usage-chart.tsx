import * as stylex from "@stylexjs/stylex";
import { crosshair, defineChart, lineY, link } from "@tanstack/charts";
import { d3Curve } from "@tanstack/charts/d3/shape";
import { decorative } from "@tanstack/charts/mark/decorative";
import { Chart } from "@tanstack/charts/react";
import type { ChartPoint } from "@tanstack/charts/react";
import { scaleLinear, scaleUtc } from "d3-scale";
import { curveMonotoneX } from "d3-shape";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import { usePageEnter } from "~/components/ui/page";
import usage from "~/lib/usage.json";
import { formatCompact, formatShortDate, toUtcDate } from "~/lib/utils";
import {
  colors,
  durations,
  easings,
  fontSizes,
  lineHeights,
  media,
  space,
} from "~/styles/tokens.stylex";

const rows = usage.daily.map((day) => ({
  date: toUtcDate(day.date),
  label: formatShortDate(day.date),
  tokens: day.tokens,
}));

type Row = (typeof rows)[number];

const first = rows[0];

const last = rows.at(-1);

/** Pixels between the data's ends and the chart's edges. */
const INSET = 64;

const STROKE_WIDTH = 1.25;

const curve = d3Curve(curveMonotoneX);

const high = Math.max(...rows.map((row) => row.tokens));

// Headroom past the peak and below zero, so the crosshair overhangs the line.
const yDomain = [-high * 0.1, high * 1.1];

// Flat runs from each end of the data out to the edge, sized in time so the
// data itself stops `INSET` pixels short at any width.
function runouts(width: number) {
  if (!first || !last) {
    return [];
  }

  const start = first.date.getTime();
  const end = last.date.getTime();
  const pad = ((end - start) * INSET) / Math.max(width - 2 * INSET, 1);

  return [
    { from: new Date(start - pad), to: first.date, tokens: first.tokens },
    { from: last.date, to: new Date(end + pad), tokens: last.tokens },
  ];
}

const definition = defineChart(
  ({ width }) => ({
    margin: 0,
    marks: [
      crosshair({
        x: { stroke: colors.fillStrong, strokeOpacity: 1, strokeWidth: 1 },
        y: false,
      }),
      decorative(
        link(runouts(width), {
          stroke: colors.textPrimary,
          strokeWidth: STROKE_WIDTH,
          x1: "from",
          x2: "to",
          y1: "tokens",
          y2: "tokens",
        })
      ),
      lineY(rows, { x: "date", y: "tokens", curve, strokeWidth: STROKE_WIDTH }),
    ],
    scales: {
      x: { scale: scaleUtc, axis: false },
      // An instance, not a factory: a factory's domain is inferred from the data.
      y: { scale: scaleLinear().domain(yDomain), axis: false },
    },
  }),
  {
    focus: "nearest-x",
    focusRing: { fill: colors.background, radius: 3.5, strokeWidth: 1.5 },
    maxFocusDistance: Number.POSITIVE_INFINITY,
  }
);

// Ends unclipped: the fill mode drops it so hover marks can reach the edges.
const draw = stylex.keyframes({
  from: { clipPath: "inset(0 100% 0 0)" },
  to: { clipPath: "inset(0 0 0 0)" },
});

const fadeOnHover = {
  transitionDuration: durations.hover,
  transitionProperty: "opacity",
  transitionTimingFunction: "ease",
} as const;

const styles = stylex.create({
  plot: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    minWidth: 0,
  },
  chart: {
    "--ts-chart-1": colors.textPrimary,
    color: colors.textMuted,
    // An inline svg leaves descender space under it, unevening the gaps.
    display: "flex",
    fontSize: fontSizes.xs,
    fontVariantNumeric: "tabular-nums",
  },
  // The block's own fade covers reduced motion.
  draw: {
    animationDuration: durations.enter,
    animationFillMode: "backwards",
    animationName: { default: draw, [media.reducedMotion]: "none" },
    animationTimingFunction: easings.inOut,
  },
  after: (delay: number) => ({
    animationDelay: `${delay}ms`,
  }),
  // Holds its height while nothing is hovered, so the plot never jumps.
  line: {
    fontVariantNumeric: "tabular-nums",
    height: lineHeights.row,
    lineHeight: lineHeights.row,
    position: "relative",
  },
  top: {
    fontSize: fontSizes.sm,
  },
  bottom: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
  },
  follow: {
    ...fadeOnHover,
    display: "flex",
    gap: space.xxs,
    insetBlockStart: 0,
    position: "absolute",
    translate: "-50% 0",
    whiteSpace: "nowrap",
  },
  end: {
    ...fadeOnHover,
    insetBlockStart: 0,
    position: "absolute",
    whiteSpace: "nowrap",
  },
  start: {
    left: INSET,
    translate: "-50% 0",
  },
  finish: {
    right: INSET,
    translate: "50% 0",
  },
  hidden: {
    opacity: 0,
  },
  value: {
    color: colors.textPrimary,
  },
  unit: {
    color: colors.textMuted,
  },
});

interface Hovered {
  row: Row;
  /** Pixels from the plot's left edge. */
  x: number;
}

/** Tracks the hovered x inside its positioned parent, kept clear of the edges. */
function Follow({
  children,
  hovered,
}: {
  children: (row: Row) => React.ReactNode;
  hovered: Hovered | null;
}) {
  const body = useRef<HTMLDivElement>(null);

  // The last point stays rendered so leaving the chart fades it out in place.
  const [shown, setShown] = useState(hovered);

  if (hovered !== null && hovered !== shown) {
    setShown(hovered);
  }

  // Written straight to the node so following the pointer costs no second render.
  useLayoutEffect(() => {
    const parent = body.current?.parentElement;

    if (shown === null || !body.current || !parent) {
      return;
    }

    const half = body.current.offsetWidth / 2;
    const center = Math.min(Math.max(shown.x, half), parent.offsetWidth - half);
    body.current.style.left = `${center}px`;
  }, [shown]);

  if (shown === null) {
    return null;
  }

  return (
    <div
      ref={body}
      {...stylex.props(styles.follow, hovered === null && styles.hidden)}
    >
      {children(shown.row)}
    </div>
  );
}

function UsageChart() {
  const [hovered, setHovered] = useState<Hovered | null>(null);
  const delay = usePageEnter()?.delay ?? null;

  const onFocusChange = useCallback((point: ChartPoint<Row> | null) => {
    setHovered(point === null ? null : { row: point.datum, x: point.x });
  }, []);

  // Chart pushes its options to the renderer on every render; hover must not re-render it.
  const chart = useMemo(
    () => (
      <Chart
        {...stylex.props(
          styles.chart,
          delay !== null && [styles.draw, styles.after(delay)]
        )}
        ariaDescription={`Tokens processed per day from ${first?.label} to ${last?.label}, including idle days.`}
        ariaLabel="Daily Claude Code tokens"
        definition={definition}
        height={160}
        initialWidth={1280}
        onFocusChange={onFocusChange}
      />
    ),
    [delay, onFocusChange]
  );

  return (
    <div {...stylex.props(styles.plot)}>
      <div {...stylex.props(styles.line, styles.top)}>
        <Follow hovered={hovered}>
          {(row) => (
            <>
              <span {...stylex.props(styles.value)}>
                {formatCompact(row.tokens)}
              </span>
              <span {...stylex.props(styles.unit)}>tokens</span>
            </>
          )}
        </Follow>
      </div>

      {chart}

      <div aria-hidden="true" {...stylex.props(styles.line, styles.bottom)}>
        <span
          {...stylex.props(
            styles.end,
            styles.start,
            hovered !== null && styles.hidden
          )}
        >
          {first?.label}
        </span>
        <span
          {...stylex.props(
            styles.end,
            styles.finish,
            hovered !== null && styles.hidden
          )}
        >
          {last?.label}
        </span>
        <Follow hovered={hovered}>{(row) => row.label}</Follow>
      </div>
    </div>
  );
}

export { UsageChart };
