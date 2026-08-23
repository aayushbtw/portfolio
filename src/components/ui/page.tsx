import { cn } from "~/lib/utils";

/**
 * Owns the space between a page's top-level blocks, so no route writes `mt-*`
 * between its sections and they can't drift apart. One gap, one place.
 *
 * The `xl` step is what DESIGN.md calls a new section: a block that introduces
 * itself with its own heading. A block that continues the one above it isn't a
 * sibling here, it lives inside that block and takes `mt-lg` there. So the
 * rule stops being a class to remember and becomes where you put the markup.
 */
function Page({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-xl", className)}
      data-slot="page"
      {...props}
    />
  );
}

export { Page };
