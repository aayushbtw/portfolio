import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  media,
  presses,
  space,
} from "~/styles/tokens.stylex";

const styles = stylex.create({
  link: {
    alignItems: "baseline",
    boxShadow: {
      default: `inset 0 -1px 0 ${colors.edgeStrong}`,
      [media.hover]: {
        default: `inset 0 -1px 0 ${colors.edgeStrong}`,
        ":hover": `inset 0 -1px 0 ${colors.textPrimary}`,
      },
    },
    color: colors.textPrimary,
    display: "inline-flex",
    gap: space.xxs,
    lineHeight: "17px",
    paddingBottom: 1,
    paddingInline: 1,
    transform: { default: null, ":active": presses.link },
    transitionDuration: `${durations.hover}, ${durations.press}`,
    transitionProperty: "box-shadow, transform",
    transitionTimingFunction: `ease, ${easings.out}`,
  },
  icon: {
    alignSelf: "center",
    display: "inline-flex",
    fontSize: 13,
    color: {
      default: colors.textMuted,
      [media.hover]: {
        default: colors.textMuted,
        [stylex.when.ancestor(":hover")]: colors.textSecondary,
      },
    },
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
  },
});

function IconLink({
  children,
  external,
  icon,
  ...props
}: Omit<React.ComponentProps<"a">, "className" | "style"> & {
  external?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <a
      rel={external ? "noopener" : undefined}
      target={external ? "_blank" : undefined}
      {...props}
      {...stylex.props(stylex.defaultMarker(), styles.link)}
    >
      <span {...stylex.props(styles.icon)}>{icon}</span>
      {children}
    </a>
  );
}

export { IconLink };
