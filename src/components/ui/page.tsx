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

const ENTER_DELAY_MS = 50;

const STAGGER_MS = 160;

const NAV_STAGGER_MS = 50;

// Five rows land inside one STAGGER_MS slot, so a list finishes before the next section starts.
const ROW_STAGGER_MS = 30;

/** The entrance delay in ms, or null outside the first-load entrance. */
const EnterContext = createContext<number | null>(null);

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
  rowEnter: {
    animationDuration: durations.enter,
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
  metaRow: {
    alignItems: "center",
    columnGap: space.md,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
  // oxlint-disable-next-line react/hook-use-state -- read once on mount, never set
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
        ? // oxlint-disable-next-line react/no-react-children -- each child staggers in on its own, so callers write plain JSX
          Children.toArray(children).map((child, i) => {
            const delay =
              mode === "first"
                ? ENTER_DELAY_MS + i * STAGGER_MS
                : i * NAV_STAGGER_MS;

            return (
              <EnterContext key={i} value={mode === "first" ? delay : null}>
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

function EnterStagger({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const delay = usePageEnter();

  if (delay === null) {
    return children;
  }

  // oxlint-disable-next-line react/no-react-children -- each row cascades in on its own, so callers write plain JSX
  return Children.toArray(children).map((child, i) => (
    <div
      key={i}
      {...stylex.props(styles.rowEnter)}
      style={{ animationDelay: `${delay + (i + 1) * ROW_STAGGER_MS}ms` }}
    >
      {child}
    </div>
  ));
}

function PageHeader({
  children,
  description,
  meta,
  metaEnd,
  title,
}: {
  children?: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  /** Sits at the right end of the meta line, wrapping below it when it can't fit. */
  metaEnd?: React.ReactNode;
  title: React.ReactNode;
}) {
  const metaLine =
    meta === undefined ? null : <p {...stylex.props(styles.meta)}>{meta}</p>;

  return (
    <header {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.heading)}>
        <h1 {...stylex.props(styles.title)}>{title}</h1>
        {description === undefined ? null : (
          <p {...stylex.props(styles.description)}>{description}</p>
        )}
        {metaEnd === undefined ? (
          metaLine
        ) : (
          <div {...stylex.props(styles.meta, styles.metaRow)}>
            {metaLine}
            {metaEnd}
          </div>
        )}
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

export { EnterStagger, Page, PageHeader, Section, usePageEnter };
