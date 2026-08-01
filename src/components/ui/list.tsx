import { cn } from "~/lib/utils";
import { Skeleton } from "./skeleton";

function List({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "not-typeset group/ul mt-sm text-fg-3 leading-5 [&_a]:no-underline",
        className
      )}
      data-slot="list"
      {...props}
    />
  );
}

function ListItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "group/list-item -mx-md rounded-md px-md py-sm transition-[background-color,scale] duration-150 hover:bg-bg-2 active:scale-[0.98]",
        className
      )}
      data-slot="list-item"
      {...props}
    />
  );
}

function ListItemHover({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "ml-auto flex items-center gap-md text-fg-3/50 opacity-0 transition-opacity duration-150 group-hover/list-item:opacity-100 *:[svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="list-item-hover"
      {...props}
    />
  );
}

function ListSkeleton({
  rows,
  rowClassName,
}: {
  rows: number;
  rowClassName?: string;
}) {
  return (
    <List>
      {Array.from({ length: rows }, (_, i) => `row-${i}`).map((key) => (
        <li className="border-border border-t py-sm first:border-t-0" key={key}>
          <Skeleton className={cn("w-full", rowClassName ?? "h-5")} />
        </li>
      ))}
    </List>
  );
}

export { List, ListItem, ListItemHover, ListSkeleton };
