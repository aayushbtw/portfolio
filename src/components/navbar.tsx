import {
  IconArticle,
  IconArticleFilled,
  IconChartPie,
  IconChartPieFilled,
  IconFolder,
  IconFolderFilled,
  IconHeadphones,
  IconHeadphonesFilled,
  IconHome,
  IconHomeFilled,
  IconSparkles,
  IconSparklesFilled,
} from "@tabler/icons-react";
import { type Hotkey, useHotkeySequences } from "@tanstack/react-hotkeys";
import type { LinkProps } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { NavList } from "~/components/ui/nav-list";
import { useHaptics } from "~/lib/haptics";

type TablerIcon = typeof IconHome;

const links: {
  name: string;
  to: LinkProps["to"];
  key: Hotkey;
  icon: TablerIcon;
  activeIcon: TablerIcon;
}[] = [
  {
    name: "Home",
    to: "/",
    key: "H",
    icon: IconHome,
    activeIcon: IconHomeFilled,
  },
  {
    name: "Projects",
    to: "/projects",
    key: "P",
    icon: IconFolder,
    activeIcon: IconFolderFilled,
  },
  {
    name: "Writings",
    to: "/writings",
    key: "W",
    icon: IconArticle,
    activeIcon: IconArticleFilled,
  },
  {
    name: "Skills",
    to: "/skills",
    key: "S",
    icon: IconSparkles,
    activeIcon: IconSparklesFilled,
  },
  {
    name: "Music",
    to: "/music",
    key: "M",
    icon: IconHeadphones,
    activeIcon: IconHeadphonesFilled,
  },
  {
    name: "Usage",
    to: "/usage",
    key: "U",
    icon: IconChartPie,
    activeIcon: IconChartPieFilled,
  },
];

/** Lives on the rail, which hides in CSS, so the keys work at every width. */
function useNavHotkeys() {
  const navigate = useNavigate();
  const { trigger } = useHaptics();

  useHotkeySequences(
    links.map((link) => ({
      sequence: ["G", link.key],
      callback: () => {
        trigger("click");
        navigate({ to: link.to });
      },
    }))
  );
}

function Navbar() {
  const { trigger } = useHaptics();
  useNavHotkeys();

  return (
    <aside className="sticky top-2xl hidden lg:block">
      <nav>
        <NavList>
          {links.map((item) => (
            <li key={item.name}>
              <Link
                className="nav-link"
                onClick={() => trigger("click")}
                to={item.to}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </NavList>
      </nav>
    </aside>
  );
}

/** Gapless on purpose: six 44px targets plus padding is all 320px allows. */
function MobileNav() {
  const { trigger } = useHaptics();

  return (
    <nav
      aria-label="Primary"
      // Paired with `pointer-events-auto` below, so the full-width nav
      // doesn't swallow taps either side of the capsule.
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-md pb-[max(var(--spacing-md),env(safe-area-inset-bottom))] lg:hidden"
    >
      <ul className="not-typeset pointer-events-auto flex items-center rounded-full bg-bg-contrast p-xs shadow-lg [&_a]:no-underline">
        {links.map((tab) => (
          <li key={tab.name}>
            <Link
              aria-label={tab.name}
              className="flex size-11 items-center justify-center rounded-full text-fg-contrast-2 transition-[background-color,color,scale] duration-150 active:scale-[0.96] data-[status=active]:bg-fg-contrast/10 data-[status=active]:text-fg-contrast"
              onClick={() => trigger("click")}
              to={tab.to}
            >
              {({ isActive }) => {
                const Icon = isActive ? tab.activeIcon : tab.icon;
                return (
                  <Icon aria-hidden="true" className="size-5" stroke={1.5} />
                );
              }}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { MobileNav, Navbar };
