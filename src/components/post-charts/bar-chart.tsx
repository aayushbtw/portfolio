"use client";

import * as stylex from "@stylexjs/stylex";
import { barX, defineChart, ruleX, text } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleBand, scaleLinear } from "d3-scale";
import { useMemo } from "react";

import type { PostChartData } from "~/components/post-charts/data";
import { colors, fontSizes } from "~/styles/tokens.stylex";

interface Bar {
  display: string;
  label: string;
  over: boolean;
  value: number;
}

const ROW = 32;
const LABEL_GUTTER = 104;
const VALUE_GUTTER = 56;
const TOP = 20;

const number = new Intl.NumberFormat("en-US");

function toBars(data: PostChartData) {
  switch (data.kind) {
    case "rate": {
      return {
        bars: data.rows.map((row): Bar => ({
          display: `${row.hits} of ${row.runs}`,
          label: row.label,
          over: false,
          value: row.hits / row.runs,
        })),
        max: 1,
      };
    }
    case "size": {
      return {
        bars: data.rows.map((row): Bar => ({
          display: number.format(row.chars),
          label: row.label,
          over: row.chars > data.limit.chars,
          value: row.chars,
        })),
        max: Math.max(data.limit.chars, ...data.rows.map((row) => row.chars)),
      };
    }
    default: {
      const _exhaustive: never = data;
      return _exhaustive;
    }
  }
}

function chartFor(data: PostChartData) {
  const { bars, max } = toBars(data);
  const limit = data.kind === "size" ? data.limit : null;
  const tracks = data.kind === "rate" ? bars : [];
  const y = scaleBand()
    .domain(bars.map((bar) => bar.label))
    .paddingInner(0.5)
    .paddingOuter(0.25);

  return {
    bars,
    definition: defineChart({
      margin: {
        bottom: 0,
        left: LABEL_GUTTER,
        right: VALUE_GUTTER,
        top: limit ? TOP : 0,
      },
      marks: [
        barX(tracks, {
          fill: colors.fill,
          radius: 4,
          x: () => 1,
          y: "label",
        }),
        barX(bars, {
          fill: (bar) =>
            bar.over || data.kind === "rate"
              ? colors.textPrimary
              : colors.textMuted,
          radius: { end: 4 },
          x: "value",
          y: "label",
        }),
        text(bars, {
          anchor: "end",
          dx: -12,
          fill: colors.textSecondary,
          fontSize: 13,
          text: "label",
          x: () => 0,
          y: "label",
        }),
        text(bars, {
          anchor: "start",
          dx: 8,
          fill: colors.textPrimary,
          fontSize: 13,
          text: "display",
          // One column past the longest bar, so no value crosses the limit rule.
          x: () => max,
          y: "label",
        }),
        ...(limit
          ? [
              ruleX([limit.chars], {
                stroke: colors.textMuted,
                strokeDasharray: "2 3",
                strokeWidth: 1,
              }),
              text([limit], {
                anchor: "middle",
                dy: -TOP,
                fill: colors.textMuted,
                fontSize: 13,
                text: "label",
                x: "chars",
                y: () => bars[0]?.label ?? "",
              }),
            ]
          : []),
      ],
      scales: {
        x: { axis: false, scale: scaleLinear().domain([0, max]) },
        y: { axis: false, scale: y },
      },
    }),
  };
}

const styles = stylex.create({
  chart: {
    color: colors.textMuted,
    display: "flex",
    fontSize: fontSizes.xs,
    fontVariantNumeric: "tabular-nums",
  },
});

function BarChart({ data }: { data: PostChartData }) {
  const { bars, definition } = useMemo(() => chartFor(data), [data]);

  return (
    <Chart
      {...stylex.props(styles.chart)}
      ariaDescription={data.description}
      ariaLabel={data.title}
      definition={definition}
      height={bars.length * ROW + (data.kind === "size" ? TOP : 0)}
      initialWidth={612}
    />
  );
}

export { BarChart };
