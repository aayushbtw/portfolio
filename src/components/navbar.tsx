import { type Hotkey, useHotkeySequences } from "@tanstack/react-hotkeys";
import type { LinkProps } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { NavList } from "@/components/ui/nav-list";
import { useHaptics } from "@/lib/haptics";

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

export function Navbar() {
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

  return (
    <aside className="sticky top-page-t hidden lg:block">
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
