import { useHotkeySequences } from "@tanstack/react-hotkeys";
import type { Hotkey } from "@tanstack/react-hotkeys";
import type { LinkProps } from "@tanstack/react-router";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

import { Breadcrumbs } from "~/components/breadcrumbs";
import { useRightColumn } from "~/components/layout-provider";
import { NowPlaying } from "~/components/now-playing";
import { ProgressiveBlur } from "~/components/ui/progressive-blur";
import { useHaptics } from "~/lib/haptics";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const destinations: { key: Hotkey; to: LinkProps["to"] }[] = [
  { key: "H", to: "/" },
  { key: "W", to: "/writings" },
  { key: "S", to: "/skills" },
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
  useHotkeys();

  return (
    // Every item names its row and column: auto placement refuses a taken cell
    // and opens an implicit column instead.
    <div className="typeset gap-x-lg gap-y-xl px-md pt-md lg:gap-x-xl grid grid-rows-[var(--spacing-lg)_auto] lg:grid-cols-[1fr_minmax(0,var(--container-content))_1fr]">
      {/* `z` keeps it out of the blur's backdrop, which is what the blur
          samples. `self-start`, or it stretches and has nowhere to stick. */}
      <div className="lg:top-md z-40 col-start-1 row-start-1 lg:sticky lg:row-span-2 lg:self-start">
        <Breadcrumbs />
      </div>

      <div className="lg:top-md hidden lg:sticky lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:block lg:self-start lg:justify-self-end">
        <NowPlaying />
      </div>

      <main
        // Owns the bottom padding so the sticky blur below has it to travel.
        className="max-w-content pb-2xl lg:pb-xl col-start-1 row-start-2 mx-auto w-full min-w-0 lg:col-start-2"
        id="main"
      >
        <Outlet />
      </main>

      <div className="hidden lg:col-start-3 lg:row-start-2 lg:block">
        {right}
      </div>

      {/* Spanning both rows, so neither starts on the page's first line.
          `inset-x-auto` undoes the component's `inset-x-0`, which on a sticky
          box is a threshold, not an offset. `-mx` gives the filter something
          to sample past the column's edge. */}
      <ProgressiveBlur
        className="-mx-md lg:-mx-xl sticky inset-x-auto top-0 z-30 col-start-1 row-span-2 row-start-1 self-start lg:col-start-2"
        position="top"
      />

      <ProgressiveBlur className="-mx-md lg:-mx-xl sticky inset-x-auto bottom-0 z-30 col-start-1 row-span-2 row-start-1 self-end lg:col-start-2" />
    </div>
  );
}
