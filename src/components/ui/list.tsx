import { createLink } from "@tanstack/react-router";

import { cn } from "~/lib/utils";

function List({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "not-typeset -mx-md mt-sm text-fg-3 [&_a]:no-underline",
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
        "group/list-item gap-md px-md py-sm hover:bg-bg-2 flex items-center rounded-md transition-colors duration-150",
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

function ListItemLeader({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-bg-2 group-hover/list-item:bg-border h-px min-w-md flex-1 transition-colors duration-150 ease-out",
        className
      )}
      data-slot="list-item-leader"
      {...props}
    />
  );
}

function ListItemMeta({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "gap-xs text-fg-3 flex shrink-0 items-center text-sm [&_svg]:size-[0.9em]",
        className
      )}
      data-slot="list-item-meta"
      {...props}
    />
  );
}

function ListItemHover({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "gap-md text-fg-3 can-hover:opacity-0 can-hover:group-hover/list-item:opacity-100 ms-auto flex items-center opacity-100 transition-opacity duration-150 *:[svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="list-item-hover"
      {...props}
    />
  );
}

export {
  List,
  ListItem,
  ListItemHover,
  ListItemLeader,
  ListItemLink,
  ListItemMeta,
  ListItemTitle,
};
