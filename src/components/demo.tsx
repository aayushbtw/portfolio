import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { explorations, isExploration } from "~/components/explorations";
import { colors, radii, space } from "~/styles/tokens.stylex";

const styles = stylex.create({
  frame: {
    backgroundColor: colors.fill,
    borderRadius: radii.md,
    padding: space.xxs,
  },
  stage: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    display: "flex",
    justifyContent: "center",
    minHeight: 384,
    paddingBlock: space.xl,
    paddingInline: space.md,
  },
});

function Demo({ name, style }: { name: string; style?: StyleXStyles }) {
  if (!isExploration(name)) {
    throw new Error(`No exploration registered as "${name}"`);
  }

  const Exploration = explorations[name];

  return (
    <div {...stylex.props(styles.frame, style)}>
      <div {...stylex.props(styles.stage)}>
        <Exploration />
      </div>
    </div>
  );
}

export { Demo };
