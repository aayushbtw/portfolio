import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

const links = [
  { name: "Home", url: "/" },
  { name: "Projects", url: "/projects" },
  { name: "Writings", url: "/writings" },
];

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div
      className={cn(
        "mx-auto max-w-[772px] px-4 pt-0 pb-8 sm:px-6",
        "lg:grid lg:max-w-7xl lg:grid-cols-[1fr_minmax(0,740px)_1fr] lg:gap-8 lg:pt-page-t"
      )}
    >
      <Navbar links={links} />

      <div className="content min-w-0 max-w-full">
        <main>
          <Outlet />
        </main>
      </div>

      <div />
    </div>
  );
}
