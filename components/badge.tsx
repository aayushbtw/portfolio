import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

function Badge({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-lg border px-1.5 py-0.5 font-mono text-xs text-badge-foreground bg-badge",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
