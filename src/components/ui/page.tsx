import * as stylex from "@stylexjs/stylex";
import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  colors,
  durations,
  easings,
  fontSizes,
  layout,
  lineHeights,
  media,
  space,
} from "~/styles/tokens.stylex";

const rise = stylex.keyframes({
  from: {
    opacity: 0,
    transform: "translateY(12px)",
  },
});

const settle = stylex.keyframes({
  from: {
    opacity: 0,
    transform: "translateY(6px)",
  },
});

const fade = stylex.keyframes({
  from: { opacity: 0 },
});

const STAGGER_MS = 160;

const NAV_STAGGER_MS = 50;

const EnterContext = createContext<{ delay: number } | null>(null);

/** The first-load entrance this block is part of, for blocks with their own. */
function usePageEnter() {
  return useContext(EnterContext);
}

// Module scope outlives route changes, so only the first document load staggers in.
let entered = false;

const styles = stylex.create({
  enter: {
    animationDuration: durations.enter,
    animationFillMode: "both",
    animationName: { default: rise, [media.reducedMotion]: fade },
    animationTimingFunction: easings.out,
  },
  // Every page after the first: the same language as the first load, quicker.
  navEnter: {
    animationDuration: durations.navigate,
    animationFillMode: "both",
    animationName: { default: settle, [media.reducedMotion]: fade },
    animationTimingFunction: easings.out,
  },
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
  enter = false,
  variant = "page",
}: {
  children: React.ReactNode;
  /** Plays the slower signature entrance on the first document load. */
  enter?: boolean;
  variant?: "compact" | "page";
}) {
  // Server and first client render agree: neither has navigated yet.
  const [mode] = useState<"first" | "nav" | null>(() => {
    if (!entered) {
      return enter ? "first" : null;
    }

    return "nav";
  });

  useEffect(() => {
    entered = true;
  }, []);

  return (
    <div
      {...stylex.props(styles.page, variant === "compact" && styles.compact)}
    >
      {mode
        ? Children.toArray(children).map((child, i) => {
            const delay = i * (mode === "first" ? STAGGER_MS : NAV_STAGGER_MS);

            return (
              <EnterContext key={i} value={mode === "first" ? { delay } : null}>
                <div
                  {...stylex.props(
                    mode === "first" ? styles.enter : styles.navEnter
                  )}
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {child}
                </div>
              </EnterContext>
            );
          })
        : children}
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

export { Page, PageHeader, Section, usePageEnter };
