import { ArrowBendUpLeft } from "@phosphor-icons/react/ArrowBendUpLeft";
import type { LinkProps } from "@tanstack/react-router";
import { Link, useRouterState } from "@tanstack/react-router";

import { useHaptics } from "~/lib/haptics";

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
    // `-mt` centres the circle on the title's first line beside it.
    <Link
      aria-label={`Back to ${target.label}`}
      className="not-typeset bg-bg-2 p-sm text-fg-3 hover:bg-border hover:text-fg-1 lg:-mt-sm flex w-fit rounded-full transition-colors duration-150 ease-out"
      onClick={() => trigger("click")}
      to={target.to}
    >
      <ArrowBendUpLeft aria-hidden="true" className="size-4" weight="light" />
    </Link>
  );
}

export { BackLink };
