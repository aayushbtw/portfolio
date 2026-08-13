import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useLeftColumn, useRightColumn } from "~/components/layout-provider";
import { Navbar } from "~/components/navbar";
import { Box } from "~/components/primitives/box";
import { Shell, ShellContent } from "~/components/ui/shell";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const left = useLeftColumn();
  const right = useRightColumn();

  return (
    <Shell>
      <Box>{left ?? <Navbar />}</Box>

      <ShellContent>
        <Outlet />
      </ShellContent>

      <Box>{right}</Box>
    </Shell>
  );
}
