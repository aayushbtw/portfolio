import { type Hotkey, useHotkeySequences } from "@tanstack/react-hotkeys";
import type { LinkProps } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useHaptics } from "~/lib/haptics";

const destinations: { key: Hotkey; to: LinkProps["to"] }[] = [
  { key: "H", to: "/" },
  { key: "W", to: "/writings" },
  { key: "S", to: "/skills" },
  { key: "M", to: "/music" },
  { key: "U", to: "/usage" },
];

/**
 * `G`+key jumps. Renders nothing: the breadcrumb only ever names the way back
 * up, so these are the only way across on a keyboard.
 */
function NavHotkeys() {
  const navigate = useNavigate();
  const { trigger } = useHaptics();

  useHotkeySequences(
    destinations.map((destination) => ({
      sequence: ["G", destination.key],
      callback: () => {
        trigger("click");
        navigate({ to: destination.to });
      },
    }))
  );

  return null;
}

export { NavHotkeys };
