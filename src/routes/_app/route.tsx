import { useHotkeySequences } from "@tanstack/react-hotkeys";
import type { Hotkey } from "@tanstack/react-hotkeys";
import type { LinkProps } from "@tanstack/react-router";
import {
  createFileRoute,
  Outlet,
  useMatch,
  useNavigate,
} from "@tanstack/react-router";

import { BackLink } from "~/components/back-link";
import { useRightColumn } from "~/components/layout-provider";
import { ProgressiveBlur } from "~/components/ui/progressive-blur";
import { useHaptics } from "~/lib/haptics";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const destinations: { key: Hotkey; to: LinkProps["to"] }[] = [
  { key: "H", to: "/" },
  { key: "W", to: "/writings" },
  { key: "S", to: "/skills" },
  { key: "E", to: "/explorations" },
  { key: "M", to: "/music" },
  { key: "U", to: "/usage" },
];

function useHotkeys() {
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
}

function AppLayout() {
  const right = useRightColumn();
  const home = useMatch({ from: "/_app/", shouldThrow: false });
  useHotkeys();

  return (
    <>
      <ProgressiveBlur className="fixed z-30" position="top" />

      <div
        className="typeset group/frame px-md gap-y-lg lg:gap-x-xl grid lg:grid-cols-[1fr_minmax(0,var(--container-content))_1fr]"
        data-home={home ? "" : undefined}
      >
        {/* `self-start`, or it stretches and has nowhere to stick. */}
        <div className="pt-xl lg:pt-2xl lg:sticky lg:top-0 lg:self-start lg:justify-self-end">
          <BackLink />
        </div>

        <main
          // Clears the bottom blur at the end of the page.
          className="max-w-content lg:pt-2xl pb-2xl lg:pb-xl group-data-home/frame:mt-xl lg:group-data-home/frame:mt-2xl mx-auto w-full min-w-0"
          id="main"
        >
          <Outlet />
        </main>

        <div className="lg:pt-2xl lg:gap-xl hidden lg:sticky lg:top-0 lg:flex lg:flex-col lg:self-start">
          {right}
        </div>
      </div>

      <ProgressiveBlur className="fixed z-30" />
    </>
  );
}
