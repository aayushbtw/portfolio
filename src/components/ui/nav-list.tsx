import * as stylex from "@stylexjs/stylex";
import { Box } from "~/components/primitives/box";
import { background, foreground } from "~/styles/tokens/color.stylex";
import { spacing } from "~/styles/tokens/layout.stylex";
import { lineHeight } from "~/styles/tokens/typography.stylex";

const styles = stylex.create({
  list: { position: "relative" },
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
     emphasis ladder as it goes from resting to hovered to current. */
  link: {
    display: "block",
    paddingInlineStart: spacing.md,
    lineHeight: lineHeight.xs,
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
    <Box
      as="ul"
      data-not-typeset
      display="flex"
      flexDirection="column"
      gap="xs"
      style={styles.list}
    >
      <Box aria-hidden="true" as="span" style={styles.indicator} />
      {children}
    </Box>
  );
}

/* Owns the anchor rather than handing its styles out, because `anchorName`
   under an attribute condition types as `unknown` in StyleX today and will not
   pass through `Box`'s typed `style` prop. Routed links keep using
   `navStyles.link` directly, where a plain spread sidesteps that. */
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
