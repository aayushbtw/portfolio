import * as stylex from "@stylexjs/stylex";
import { background, foreground } from "~/styles/tokens/color.stylex";
import { spacing } from "~/styles/tokens/layout.stylex";
import { fontWeight, lineHeight } from "~/styles/tokens/typography.stylex";

const styles = stylex.create({
  list: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: spacing.xs,
  },
  /* The travelling dot. It is positioned against whichever link is active
     through CSS anchor positioning: the active link publishes `--active` as an
     anchor name, and this reads it. That is why the two rules below have to
     agree on the name. */
  indicator: {
    position: "absolute",
    left: 0,
    height: "0.5rem",
    width: "2px",
    borderRadius: "9999px",
    top: "anchor(center)",
    positionAnchor: "--active",
    transform: "translateY(-50%)",
    transitionProperty: "top",
    transitionDuration: "500ms",
    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    backgroundImage: `linear-gradient(to bottom, ${background.brand}, color-mix(in oklch, ${background.brand} 60%, transparent))`,
  },
  /* A destination, not a link in a sentence: no underline, and it climbs the
     emphasis ladder as it goes from resting to hovered to current.

     Colour is the whole ladder, so the weight is the body weight. Stated rather
     than inherited: these links used to pick up `medium` from typeset's prose
     anchor rule, which put them a step above every other resting label on the
     page for no reason anyone chose. */
  link: {
    display: "block",
    paddingInlineStart: spacing.md,
    lineHeight: lineHeight.xs,
    fontWeight: fontWeight.regular,
    textDecorationLine: "none",
    color: {
      default: foreground["fg-3"],
      ":hover": foreground["fg-2"],
      '[data-status="active"]': foreground["fg-1"],
    },
    // The active link publishes the anchor the indicator positions against.
    anchorName: { default: "none", '[data-status="active"]': "--active" },
    scale: { default: "1", ":active": "0.96" },
    transitionProperty: "color, scale",
    transitionDuration: "200ms",
  },
});

export function NavList({ children }: { children: React.ReactNode }) {
  return (
    <ul {...stylex.props(styles.list)}>
      <span aria-hidden="true" {...stylex.props(styles.indicator)} />
      {children}
    </ul>
  );
}

/* Owns the anchor so a plain `href` link and a routed `Link` both get the same
   treatment; the routed one spreads `navStyles.link` itself. */
export function NavLink({
  active,
  children,
  href,
}: {
  active?: boolean;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      data-status={active ? "active" : undefined}
      href={href}
      {...stylex.props(styles.link)}
    >
      {children}
    </a>
  );
}

export { styles as navStyles };
