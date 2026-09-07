import { createLink } from "@tanstack/react-router";

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
        "group/list-item -mx-md gap-md px-md py-sm hover:bg-bg-2 flex items-center rounded-md transition-colors duration-150",
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
  ListItemDescription,
  ListItemHover,
  ListItemLink,
  ListItemTitle,
};
