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

      <div className="typeset grid gap-x-lg px-md lg:grid-cols-[1fr_minmax(0,var(--container-content))_1fr]">
        <div className="lg:sticky lg:top-md lg:self-start">
          <Breadcrumbs />
        </div>

        <main className="mx-auto w-full min-w-0 max-w-content" id="main">
          {/* Sized by the column it sits in, so the trail and the table of
              contents in the gutters are never under it. `-mb` because it
              stands in front of the page rather than above it. */}
          <ProgressiveBlur
            className="sticky top-0 z-30 -mb-12"
            position="top"
          />

          <div className="pt-xl pb-2xl lg:pt-2xl lg:pb-xl">
            <Outlet />
          </div>

          <ProgressiveBlur className="sticky bottom-0 z-30 -mt-12" />
        </main>

        {/* Scoped to this layout, not the root: the 404 and error pages render
            outside `_app` and have no business advertising a song. Hidden
            below `lg` so an empty column can't open a row of its own. */}
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
