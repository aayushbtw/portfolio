import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import {
  colors,
  fonts,
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
    overflowX: "auto",
    padding: space.xxs,
  },
  stage: {
    "--ondine-bg": colors.background,
    "--ondine-border": colors.edgeStrong,
    "--ondine-fg": colors.textPrimary,
    "--ondine-font": fonts.sans,
    "--ondine-line": colors.textMuted,
    "--ondine-muted": colors.textMuted,
    "--ondine-radius": radii.sm,
    "--ondine-stroke": "1px",
    "--ondine-surface": colors.background,
    "--ondine-surface-alt": colors.fill,
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    boxShadow: shadows.card,
    display: "flex",
    justifyContent: "center",
    minWidth: "100%",
    paddingBlock: space.lg,
    paddingInline: space.md,
    // Keeps the SVG at its compiled size, so a narrow screen scrolls the frame instead of shrinking the labels.
    width: "max-content",
  },
  caption: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    marginBlockStart: space.xs,
    textAlign: "center",
  },
});

/** Mermaid compiled to SVG at build time in tomekit.config.ts. */
function Diagram({
  svg,
  title,
  style,
}: {
  svg: string;
  title: string;
  style?: StyleXStyles;
}) {
  return (
    <figure {...stylex.props(style)}>
      <div {...stylex.props(styles.frame)}>
        <div
          // oxlint-disable-next-line react/no-danger -- ondine's own output from Markdown we wrote, compiled at build time
          dangerouslySetInnerHTML={{ __html: svg }}
          {...stylex.props(styles.stage)}
        />
      </div>
      {title && (
        <figcaption {...stylex.props(styles.caption)}>{title}</figcaption>
      )}
    </figure>
  );
}

export { Diagram };
