import { cn } from "@/lib/utils";

function List({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("group/list flex flex-col gap-y-xs", className)}
      {...props}
    />
  );
}

export { List };
