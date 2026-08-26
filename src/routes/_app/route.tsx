import { type Hotkey, useHotkeySequences } from "@tanstack/react-hotkeys";
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
    <div className="typeset grid grid-rows-[var(--spacing-lg)_auto] gap-x-lg gap-y-xl px-md pt-md lg:grid-cols-[1fr_minmax(0,var(--container-content))_1fr] lg:gap-x-xl">
      <div className="z-40 col-start-1 row-start-1 lg:sticky lg:top-md lg:row-span-2 lg:self-start">
        <Breadcrumbs />
      </div>

      <div className="hidden lg:sticky lg:top-md lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:block lg:self-start lg:justify-self-end">
        <NowPlaying />
      </div>

      <main
        className="col-start-1 row-start-2 mx-auto w-full min-w-0 max-w-content pb-2xl lg:col-start-2 lg:pb-xl"
        id="main"
      >
        <Outlet />
      </main>

      <div className="hidden lg:col-start-3 lg:row-start-2 lg:block">
        {right}
      </div>

      {/* Over the page column across both rows, not inside it: `main` starts at
          the second row, which is the page's first line. */}
      <ProgressiveBlur
        className="sticky inset-x-auto top-0 z-30 col-start-1 row-span-2 row-start-1 -mx-md self-start lg:col-start-2 lg:-mx-xl"
        position="top"
      />

      <ProgressiveBlur className="sticky inset-x-auto bottom-0 z-30 col-start-1 row-span-2 row-start-1 -mx-md self-end lg:col-start-2 lg:-mx-xl" />
    </div>
  );
}
