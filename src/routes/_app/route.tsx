import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useLeftColumn, useRightColumn } from "~/components/layout-provider";
import { Navbar } from "~/components/navbar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const left = useLeftColumn();
  const right = useRightColumn();

  return (
    <div className="typeset mx-auto max-w-7xl px-md py-xl sm:px-lg lg:grid lg:grid-cols-[1fr_minmax(0,var(--container-content))_1fr] lg:gap-lg lg:pt-2xl">
      <div>{left ?? <Navbar />}</div>

      <main className="mx-auto w-full min-w-0 max-w-content" id="main">
        <Outlet />
      </main>

      <div>{right}</div>
    </div>
  );
}
