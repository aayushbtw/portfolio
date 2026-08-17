import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { breakpoint } from "~/styles/breakpoints.stylex";
import { background, foreground } from "~/styles/tokens/color.stylex";
import { radius, spacing } from "~/styles/tokens/layout.stylex";
import { fontWeight } from "~/styles/tokens/typography.stylex";

const styles = stylex.create({
  page: {
    marginInline: "auto",
    maxWidth: "80rem",
    paddingInline: { default: spacing.md, [breakpoint.sm]: spacing.lg },
    paddingBlock: spacing.xl,
    /* Three tracks: the content column is fixed at its reading measure and the
       two rails share whatever is left, which is what keeps the text centred
       on the page while a sidebar hangs beside it. */
    display: { default: "block", [breakpoint.lg]: "grid" },
    gridTemplateColumns: {
      default: null,
      [breakpoint.lg]: "1fr minmax(0, 740px) 1fr",
    },
    gap: { default: null, [breakpoint.lg]: spacing.lg },
    paddingBlockStart: { default: null, [breakpoint.lg]: spacing["2xl"] },
  },
  content: {
    marginInline: "auto",
    width: "100%",
    minWidth: 0,
    maxWidth: "740px",
  },
  body: { minHeight: "100vh" },
  fallbackPage: {
    marginInline: "auto",
    paddingInline: spacing.lg,
    paddingBlock: { default: spacing.xl, [breakpoint.sm]: spacing["2xl"] },
  },
  fallbackBody: {
    display: "flex",
    height: "calc(100vh - 12rem)",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  homeLink: {
    display: "inline-flex",
    fontWeight: fontWeight.regular,
    marginBlockStart: spacing.lg,
    minHeight: "2.25rem",
    alignItems: "center",
    borderRadius: radius.md,
    paddingInline: spacing.md,
    textDecorationLine: "none",
    outlineStyle: "solid",
    color: { default: null, ":hover": foreground["fg-1"] },
    scale: { default: "1", ":active": "0.96" },
    transitionProperty: "color, scale",
    transitionDuration: "300ms",
  },
  /* Off-screen until tabbed to, then a real target in the top-left corner. The
     nav is a sticky sidebar with six links, so keyboard users otherwise walk
     the whole thing on every page. */
  skipLink: {
    position: { default: "absolute", ":focus-visible": "fixed" },
    width: { default: "1px", ":focus-visible": "auto" },
    height: { default: "1px", ":focus-visible": "auto" },
    padding: {
      default: 0,
      ":focus-visible": `${spacing.sm} ${spacing.md}`,
    },
    margin: { default: "-1px", ":focus-visible": 0 },
    overflow: { default: "hidden", ":focus-visible": "visible" },
    clipPath: { default: "inset(50%)", ":focus-visible": "none" },
    whiteSpace: { default: "nowrap", ":focus-visible": "normal" },
    top: { default: null, ":focus-visible": spacing.md },
    left: { default: null, ":focus-visible": spacing.md },
    zIndex: 50,
    fontWeight: fontWeight.regular,
    borderRadius: radius.sm,
    borderWidth: { default: 0, ":focus-visible": "1px" },
    borderStyle: "solid",
    borderColor: "currentColor",
    backgroundColor: background["bg-1"],
    color: foreground["fg-1"],
    textDecorationLine: "none",
  },
});

export function Shell({ children }: { children: React.ReactNode }) {
  return <div {...stylex.props(styles.page)}>{children}</div>;
}

export function ShellContent({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" {...stylex.props(styles.content)}>
      {children}
    </main>
  );
}

/* The error and not-found pages: one centred column, no navigation. Sized off
   the viewport minus the fixed blurs so the message sits optically centred. */
export function FallbackShell({ children }: { children: React.ReactNode }) {
  return (
    <div {...stylex.props(styles.fallbackPage)}>
      <div {...stylex.props(styles.fallbackBody)}>{children}</div>
    </div>
  );
}

/* The one way back from an error page. */
export function HomeLink() {
  return (
    <Link {...stylex.props(styles.homeLink)} to="/">
      Go Home
    </Link>
  );
}

export function RootBody({ children }: { children: React.ReactNode }) {
  return <body {...stylex.props(styles.body)}>{children}</body>;
}

export function SkipLink() {
  return (
    <a href="#main" {...stylex.props(styles.skipLink)}>
      Skip to content
    </a>
  );
}
