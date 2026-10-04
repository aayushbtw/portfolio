import { ArrowBendUpLeft } from "@phosphor-icons/react/ArrowBendUpLeft";
import * as stylex from "@stylexjs/stylex";
import type { LinkProps } from "@tanstack/react-router";
import { Link, useRouterState } from "@tanstack/react-router";

import { useHaptics } from "~/lib/haptics";
import { colors, media, radii, space } from "~/styles/tokens.stylex";

const styles = stylex.create({
  link: {
    backgroundColor: { default: colors.fill, ":hover": colors.fillStrong },
    borderRadius: radii.full,
    color: { default: colors.textMuted, ":hover": colors.textPrimary },
    display: "flex",
    marginTop: { default: 0, [media.lg]: `calc(-1 * ${space.xs})` },
    padding: space.xs,
    width: "fit-content",
  },
});

const sections = {
  explorations: { label: "Explorations", to: "/explorations" },
  skills: { label: "Skills", to: "/skills" },
  writings: { label: "Writings", to: "/writings" },
} satisfies Record<string, { label: string; to: LinkProps["to"] }>;

function isSection(segment: string): segment is keyof typeof sections {
  return Object.hasOwn(sections, segment);
}

function parent(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  if (segments.length === 1) {
    return { label: "Home", to: "/" as const };
  }

  const [section] = segments;

  return isSection(section)
    ? sections[section]
    : { label: "Home", to: "/" as const };
}

function BackLink() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { trigger } = useHaptics();

  const target = parent(pathname);

  if (!target) {
    return null;
  }

  return (
    <Link
      aria-label={`Back to ${target.label}`}
      {...stylex.props(styles.link)}
      onClick={() => trigger("click")}
      to={target.to}
    >
      <ArrowBendUpLeft aria-hidden="true" size={16} weight="light" />
    </Link>
  );
}

export { BackLink };
