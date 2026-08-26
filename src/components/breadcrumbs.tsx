import { IconChevronRight } from "@tabler/icons-react";
import type { LinkProps } from "@tanstack/react-router";
import { Link, useRouterState } from "@tanstack/react-router";
import { useCrumb } from "~/components/layout-provider";
import { useHaptics } from "~/lib/haptics";

const sections: Record<string, { label: string; to: LinkProps["to"] }> = {
  writings: { label: "Writings", to: "/writings" },
  skills: { label: "Skills", to: "/skills" },
  music: { label: "Music", to: "/music" },
  usage: { label: "Usage", to: "/usage" },
};

interface Crumb {
  label: string;
  to?: LinkProps["to"];
}

function trail(pathname: string, leaf: string | null): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ label: "Home", to: "/" }];

  for (const [index, segment] of segments.entries()) {
    const section = sections[segment];
    const last = index === segments.length - 1;

    if (section) {
      crumbs.push({ label: section.label, to: last ? undefined : section.to });
      continue;
    }

    crumbs.push({ label: leaf ?? segment.replace(/-/g, " ") });
  }

  return crumbs;
}

function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const leaf = useCrumb();
  const { trigger } = useHaptics();

  const crumbs = trail(pathname, leaf);

  if (crumbs.length < 2) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="not-typeset min-w-0">
      <ol className="flex items-center gap-xs text-sm [&_a]:no-underline">
        {crumbs.map((crumb, index) => (
          <li className="flex min-w-0 items-center gap-xs" key={crumb.label}>
            {index > 0 && (
              <IconChevronRight
                aria-hidden="true"
                className="size-3.5 shrink-0 text-fg-4"
                stroke={1.5}
              />
            )}

            {crumb.to ? (
              <Link
                className="shrink-0 text-fg-3 transition-colors duration-150 hover:text-fg-1"
                onClick={() => trigger("click")}
                to={crumb.to}
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate text-fg-1">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export { Breadcrumbs };
