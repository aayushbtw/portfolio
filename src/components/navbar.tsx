import { type Hotkey, useHotkeySequences } from "@tanstack/react-hotkeys";
import type { LinkProps } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { useWebHaptics } from "web-haptics/react";
import { NavList } from "@/components/ui/nav-list";

const links: {
  name: string;
  to: LinkProps["to"];
  key: Hotkey;
}[] = [
  { name: "Home", to: "/", key: "H" },
  { name: "Projects", to: "/projects", key: "P" },
  { name: "Writings", to: "/writings", key: "W" },
  { name: "Skills", to: "/skills", key: "S" },
];

function SideNavbar({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav>
      <NavList>
        {links.map((item) => (
          <li key={item.name}>
            <Link className="nav-link" onClick={onNavigate} to={item.to}>
              {item.name}
            </Link>
          </li>
        ))}
      </NavList>
    </nav>
  );
}

export function Navbar() {
  const navigate = useNavigate();
  const { trigger } = useWebHaptics({ debug: true });

  const triggerHaptic = () => trigger("rigid");

  useHotkeySequences(
    links.map((link) => ({
      sequence: ["G", link.key],
      callback: () => {
        triggerHaptic();
        navigate({ to: link.to });
      },
    }))
  );

  return (
    <aside className="sticky top-page-t hidden lg:block">
      <SideNavbar onNavigate={triggerHaptic} />
    </aside>
  );
}
