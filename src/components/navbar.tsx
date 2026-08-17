import * as stylex from "@stylexjs/stylex";
import { type Hotkey, useHotkeySequences } from "@tanstack/react-hotkeys";
import type { LinkProps } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { NavList, navStyles } from "~/components/ui/nav-list";
import { Sidebar } from "~/components/ui/sidebar";
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
    <Sidebar>
      <nav>
        <NavList>
          {links.map((item) => (
            <li key={item.name}>
              <Link
                {...stylex.props(navStyles.link)}
                onClick={() => trigger("click")}
                to={item.to}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </NavList>
      </nav>
    </Sidebar>
  );
}
