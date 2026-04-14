import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useLeftColumn, useRightColumn } from "@/components/layout-provider";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const left = useLeftColumn();
  const right = useRightColumn();

  return (
    <div
      className={cn(
        "px-4 pt-8 pb-floating-nav-inset sm:px-6 lg:pt-page-t lg:pb-page-t",
        "mx-auto max-w-[772px]",
        "lg:grid lg:max-w-7xl lg:grid-cols-[1fr_minmax(0,740px)_1fr] lg:gap-8"
      )}
    >
      <div>{left ?? <Navbar />}</div>

      <main className="min-w-0 max-w-full">
        <Outlet />
      </main>

      <div>{right}</div>
    </div>
  );
}
