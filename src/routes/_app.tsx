import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Navbar } from "@/components/navbar";
import { SidebarProvider } from "@/components/sidebar";
import { cn } from "@/lib/utils";

function AppLayout() {
  return (
    <SidebarProvider>
      <div
        className={cn(
          "px-4 pt-8 pb-floating-nav-inset sm:px-6 lg:pt-page-t lg:pb-page-t",
          "mx-auto max-w-[772px]",
          "lg:grid lg:max-w-7xl lg:grid-cols-[1fr_minmax(0,740px)_1fr] lg:gap-8"
        )}
      >
        <Navbar />

        <main className="min-w-0 max-w-full">
          <Outlet />
        </main>

        <div />
      </div>
    </SidebarProvider>
  );
}

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});
