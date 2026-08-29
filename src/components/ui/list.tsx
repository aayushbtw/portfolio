import { createLink } from "@tanstack/react-router";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

function List({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "not-typeset mt-sm text-fg-3 [&_a]:no-underline",
        className
      )}
      data-slot="list"
      {...props}
    />
  );
}

function ListItem({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "group/list-item -mx-md flex items-center gap-md rounded-md px-md py-sm transition-colors duration-150 hover:bg-bg-2",
        className
      )}
      data-slot="list-item"
      {...props}
    />
  );
}

const ListItemLink = createLink(ListItem);

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
      className={cn("mt-xs text-fg-4 leading-5", className)}
      data-slot="list-item-description"
      {...props}
    />
  );
}

function ListItemHover({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "ms-auto flex items-center gap-md text-fg-3 can-hover:opacity-0 opacity-100 transition-opacity duration-150 can-hover:group-hover/list-item:opacity-100 *:[svg:not([class*='size-'])]:size-4",
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
      {/* `ListItem`'s box minus the hover, so nothing shifts on landing. */}
      {Array.from({ length: rows }, (_, i) => `row-${i}`).map((key) => (
        <div className="-mx-md px-md py-sm" key={key}>
          <Skeleton className={cn("w-full", rowClassName ?? "h-5")} />
        </div>
      ))}
    </List>
  );
}

export {
  List,
  ListItem,
  ListItemDescription,
  ListItemHover,
  ListItemLink,
  ListItemTitle,
  ListSkeleton,
};
