import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { useRightColumn } from "~/components/layout-provider";
import { NavHotkeys } from "~/components/nav-hotkeys";
import { NowPlaying } from "~/components/now-playing";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const right = useRightColumn();

  return (
    <>
      <NavHotkeys />

      {/* Outside the centred frame: this row belongs to the window's edges,
          and it keeps its height on the home page where both slots are
          empty. Stacks above the top blur, which otherwise smears it at
          rest, and below the skip link. */}
      <header className="relative z-40 mb-xl flex min-h-lg items-center gap-md px-md pt-lg lg:sticky lg:top-0">
        <Breadcrumbs />
        {/* Scoped to this layout, not the root: the 404 and error pages render
            outside `_app` and have no business advertising a song. */}
        <NowPlaying />
      </header>

      <div className="typeset mx-auto max-w-7xl px-md pb-2xl lg:grid lg:grid-cols-[1fr_minmax(0,var(--container-content))_1fr] lg:gap-lg lg:pb-xl">
        <div />

        <main className="mx-auto w-full min-w-0 max-w-content" id="main">
          <Outlet />
        </main>

        <div>{right}</div>
      </div>
    </>
  );
}
