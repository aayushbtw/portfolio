import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useLeftColumn, useRightColumn } from "~/components/layout-provider";
import { Navbar } from "~/components/navbar";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const left = useLeftColumn();
  const right = useRightColumn();

  return (
    <div
      className={cn(
        "typeset",
        "mx-auto max-w-7xl px-md pt-lg pb-lg sm:px-lg lg:pt-2xl lg:pb-2xl",
        "lg:grid lg:grid-cols-[1fr_minmax(0,740px)_1fr] lg:gap-lg"
      )}
    >
      <div>{left ?? <Navbar />}</div>

      <main className="mx-auto w-full min-w-0 max-w-[740px]">
        <Outlet />
      </main>

      <div>{right}</div>
    </div>
  );
}
