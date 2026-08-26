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
    <div className="typeset grid gap-lg px-md lg:grid-cols-[1fr_minmax(0,var(--container-content))_1fr] lg:gap-x-xl">
      <div className="min-h-xl pt-md lg:sticky lg:top-md lg:min-h-0 lg:self-start lg:pt-0">
        <Breadcrumbs />
      </div>

      <main className="mx-auto w-full min-w-0 max-w-content" id="main">
        <ProgressiveBlur
          className="sticky top-0 z-30 -mx-md -mb-12 lg:-mx-xl"
          position="top"
        />

        <div className="pt-xl pb-2xl lg:pt-2xl lg:pb-xl">
          <Outlet />
        </div>

        <ProgressiveBlur className="sticky bottom-0 z-30 -mx-md -mt-12 lg:-mx-xl" />
      </main>

      <div className="hidden lg:block">
        <div className="sticky top-md flex justify-end">
          <NowPlaying />
        </div>

        {right}
      </div>
    </div>
  );
}
