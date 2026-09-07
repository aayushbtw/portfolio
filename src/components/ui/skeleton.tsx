import { cn } from "~/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("bg-bg-2 animate-pulse rounded-sm", className)}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
