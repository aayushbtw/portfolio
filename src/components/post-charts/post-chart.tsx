import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { BarChart } from "~/components/post-charts/bar-chart";
import { isPostChart, postCharts } from "~/components/post-charts/data";
import {
  colors,
  fontSizes,
  radii,
  shadows,
  space,
} from "~/styles/tokens.stylex";

const styles = stylex.create({
  frame: {
    backgroundColor: colors.fill,
    borderRadius: radii.md,
    boxShadow: shadows.card,
    padding: space.xxs,
  },
  stage: {
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    boxShadow: shadows.card,
    paddingBlock: space.md,
    paddingInline: space.md,
  },
  caption: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    marginBlockStart: space.xs,
    textAlign: "center",
  },
});

function PostChart({ name, style }: { name: string; style?: StyleXStyles }) {
  if (!isPostChart(name)) {
    throw new Error(`No post chart registered as "${name}"`);
  }

  const data = postCharts[name];

  return (
    <figure {...stylex.props(style)}>
      <div {...stylex.props(styles.frame)}>
        <div {...stylex.props(styles.stage)}>
          <BarChart data={data} />
        </div>
      </div>
      <figcaption {...stylex.props(styles.caption)}>{data.title}</figcaption>
    </figure>
  );
}

export { PostChart };
