import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { useRightColumn } from "~/components/layout-provider";
import { NavHotkeys } from "~/components/nav-hotkeys";
import { NowPlaying } from "~/components/now-playing";
import { ProgressiveBlur } from "~/components/ui/progressive-blur";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const right = useRightColumn();

  return (
    <>
      <NavHotkeys />

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
    </>
  );
}
