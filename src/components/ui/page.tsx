import { cn } from "~/lib/utils";

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
