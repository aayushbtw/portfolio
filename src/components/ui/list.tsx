import { cn } from "~/lib/utils";

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
        "group/list-item -mx-md rounded-lg px-md py-sm transition-[background-color,scale] duration-150 hover:bg-bg-2 active:scale-[0.98]",
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

export { List, ListItem, ListItemHover };
