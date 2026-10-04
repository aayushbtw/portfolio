import * as stylex from "@stylexjs/stylex";
import { crosshair, defineChart, lineY } from "@tanstack/charts";
import { d3Curve } from "@tanstack/charts/d3/shape";
import { Chart } from "@tanstack/charts/react";
import type { ChartPoint } from "@tanstack/charts/react";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleUtc } from "d3-scale";
import { curveMonotoneX } from "d3-shape";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import usage from "~/lib/usage.json";
import { formatCompact, formatShortDate, toUtcDate } from "~/lib/utils";
import { colors, fontSizes, lineHeights, space } from "~/styles/tokens.stylex";

const rows = usage.daily.map((day) => ({
  date: toUtcDate(day.date),
  label: formatShortDate(day.date),
  tokens: day.tokens,
}));

type Row = (typeof rows)[number];

const curve = d3Curve(curveMonotoneX);

const monthFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

const definition = defineChart(
  {
    marks: [
      crosshair({
        x: {
          stroke: colors.borderStrong,
          strokeOpacity: 1,
          strokeWidth: 1,
          strokeDasharray: "3 3",
        },
        y: false,
      }),
      lineY(rows, { x: "date", y: "tokens", curve, strokeWidth: 1.25 }),
    ],
    scales: {
      x: {
        scale: scaleUtc,
        axis: {
          line: false,
          ticks: {
            count: 4,
            padding: 12,
            size: 0,
            format: (date) => monthFormat.format(date),
          },
        },
      },
      y: { scale: scaleLinear, axis: false },
    },
  },
  {
    focus: "nearest-x",
    focusRing: false,
    maxFocusDistance: Number.POSITIVE_INFINITY,
  }
);

const styles = stylex.create({
  plot: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    minWidth: 0,
  },
  chart: {
    "--ts-chart-1": colors.accent,
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    fontVariantNumeric: "tabular-nums",
  },
  readout: {
    // Holds its line while nothing is hovered, so the plot never jumps.
    height: lineHeights.row,
    fontSize: fontSizes.sm,
    fontVariantNumeric: "tabular-nums",
    lineHeight: lineHeights.row,
    position: "relative",
  },
  readoutBody: {
    display: "flex",
    gap: space.xs,
    insetBlockStart: 0,
    position: "absolute",
    translate: "-50% 0",
    whiteSpace: "nowrap",
  },
  date: {
    color: colors.textMuted,
  },
  value: {
    color: colors.textPrimary,
  },
});

interface Hovered {
  row: Row;
  /** Pixels from the plot's left edge. */
  x: number;
}

function Readout({ hovered }: { hovered: Hovered | null }) {
  const line = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);

  // Written straight to the node so following the pointer costs no second render.
  useLayoutEffect(() => {
    if (hovered === null || line.current === null || body.current === null) {
      return;
    }

    const half = body.current.offsetWidth / 2;
    const width = line.current.offsetWidth;
    const center = Math.min(Math.max(hovered.x, half), width - half);
    body.current.style.left = `${center}px`;
  }, [hovered]);

  return (
    <div ref={line} {...stylex.props(styles.readout)}>
      {hovered === null ? null : (
        <div ref={body} {...stylex.props(styles.readoutBody)}>
          <span {...stylex.props(styles.date)}>{hovered.row.label}</span>
          <span {...stylex.props(styles.value)}>
            {formatCompact(hovered.row.tokens)}
          </span>
        </div>
      )}
    </div>
  );
}

function UsageChart() {
  const [hovered, setHovered] = useState<Hovered | null>(null);

  const onFocusChange = useCallback((point: ChartPoint<Row> | null) => {
    setHovered(point === null ? null : { row: point.datum, x: point.x });
  }, []);

  // Chart pushes its options to the renderer on every render; hover must not re-render it.
  const chart = useMemo(
    () => (
      <Chart
        {...stylex.props(styles.chart)}
        ariaDescription={`Tokens processed per day from ${rows[0]?.label} to ${rows.at(-1)?.label}, including idle days.`}
        ariaLabel="Daily Claude Code tokens"
        definition={definition}
        height={160}
        initialWidth={644}
        onFocusChange={onFocusChange}
      />
    ),
    [onFocusChange]
  );

  return (
    <div {...stylex.props(styles.plot)}>
      <Readout hovered={hovered} />
      {chart}
    </div>
  );
}

export { UsageChart };
