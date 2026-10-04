import * as stylex from "@stylexjs/stylex";

import {
  colors,
  fontSizes,
  layout,
  lineHeights,
  space,
} from "~/styles/tokens.stylex";

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: layout.sectionGap,
  },
  compact: {
    gap: space.lg,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    position: "relative",
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
  },
  title: {
    alignItems: "center",
    color: colors.textPrimary,
    display: "flex",
    gap: 6,
    letterSpacing: "-0.1px",
    lineHeight: lineHeights.row,
  },
  description: {
    color: colors.textSecondary,
  },
  meta: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    fontVariantNumeric: "tabular-nums",
    lineHeight: lineHeights.row,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
  },
  sectionTitle: {
    color: colors.textMuted,
    lineHeight: lineHeights.row,
  },
});

function Page({
  children,
  variant = "page",
}: {
  children: React.ReactNode;
  variant?: "compact" | "page";
}) {
  return (
    <div
      {...stylex.props(styles.page, variant === "compact" && styles.compact)}
    >
      {children}
    </div>
  );
}

function PageHeader({
  children,
  description,
  meta,
  title,
}: {
  children?: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  title: React.ReactNode;
}) {
  return (
    <header {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.heading)}>
        <h1 {...stylex.props(styles.title)}>{title}</h1>
        {description ? (
          <p {...stylex.props(styles.description)}>{description}</p>
        ) : null}
        {meta ? <p {...stylex.props(styles.meta)}>{meta}</p> : null}
      </div>
      {children}
    </header>
  );
}

function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section {...stylex.props(styles.section)}>
      <h2 {...stylex.props(styles.sectionTitle)}>{title}</h2>
      {children}
    </section>
  );
}

export { Page, PageHeader, Section };
