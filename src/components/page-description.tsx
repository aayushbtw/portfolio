import * as stylex from "@stylexjs/stylex";

import { colors, space } from "~/styles/tokens.stylex";

const styles = stylex.create({
  description: {
    color: colors.textSecondary,
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
  },
});

function PageDescription({ children }: { children: React.ReactNode }) {
  return <div {...stylex.props(styles.description)}>{children}</div>;
}

export { PageDescription };
