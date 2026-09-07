import { cn } from "~/lib/utils";

function Page({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("gap-xl flex flex-col", className)}
      data-slot="page"
      {...props}
    />
  );
}

export { Page };
