import * as stylex from "@stylexjs/stylex";

import { colors, durations, easings, space } from "~/styles/tokens.stylex";

const styles = stylex.create({
  link: {
    alignItems: "center",
    borderBottomColor: {
      default: colors.borderStrong,
      ":hover": colors.textPrimary,
    },
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    color: colors.textPrimary,
    display: "inline-flex",
    gap: space.xxs,
    lineHeight: "17px",
    paddingInline: 1,
    transform: { default: null, ":active": "scale(0.97)" },
    transitionDuration: `${durations.hover}, ${durations.press}`,
    transitionProperty: "border-bottom-color, transform",
    transitionTimingFunction: `ease, ${easings.out}`,
  },
  icon: {
    display: "inline-flex",
    fontSize: 13,
    color: {
      default: colors.textMuted,
      [stylex.when.ancestor(":hover")]: colors.textSecondary,
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
