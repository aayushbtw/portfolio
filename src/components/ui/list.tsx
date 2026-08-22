import { cn } from "~/lib/utils";
import { Skeleton } from "./skeleton";

function List({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "not-typeset mt-sm text-fg-3 [&_a]:no-underline",
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

function ListItemTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-fg-1", className)}
      data-slot="list-item-title"
      {...props}
    />
  );
}

function ListItemDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("mt-xs text-compact text-fg-4", className)}
      data-slot="list-item-description"
      {...props}
    />
  );
}

function ListItemHover({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "ml-auto flex items-center gap-md text-fg-3 opacity-0 transition-opacity duration-150 group-hover/list-item:opacity-100 *:[svg:not([class*='size-'])]:size-4",
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
      {/* Same box as `ListItem` minus the hover, so nothing shifts when the
          real rows land. */}
      {Array.from({ length: rows }, (_, i) => `row-${i}`).map((key) => (
        <li className="-mx-md px-md py-sm" key={key}>
          <Skeleton className={cn("w-full", rowClassName ?? "h-5")} />
        </li>
      ))}
    </List>
  );
}

export {
  List,
  ListItem,
  ListItemDescription,
  ListItemHover,
  ListItemTitle,
  ListSkeleton,
};
