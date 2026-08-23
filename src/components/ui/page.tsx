import { cn } from "~/lib/utils";

/** The space between a page's sections, so no route writes `mt-xl` by hand. */
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
