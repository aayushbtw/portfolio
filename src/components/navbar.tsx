import { type Hotkey, useHotkeySequences } from "@tanstack/react-hotkeys";
import type { LinkProps } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { NavList } from "~/components/ui/nav-list";
import { useHaptics } from "~/lib/haptics";

const links: {
  name: string;
  to: LinkProps["to"];
  key: Hotkey;
}[] = [
  { name: "Home", to: "/", key: "H" },
  { name: "Projects", to: "/projects", key: "P" },
  { name: "Writings", to: "/writings", key: "W" },
  { name: "Skills", to: "/skills", key: "S" },
  { name: "Music", to: "/music", key: "M" },
  { name: "Usage", to: "/usage", key: "U" },
];

function Navbar() {
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
    // Below `lg` this is a wrapped row above the content rather than a rail:
    // the sidebar is the only navigation the site has, and hiding it left every
    // page but home unreachable on a phone.
    <aside className="mb-lg lg:sticky lg:top-2xl lg:mb-0">
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

export { Navbar };
