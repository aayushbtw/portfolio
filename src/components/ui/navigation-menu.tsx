import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

function NavigationMenu({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <nav className={cn("sticky top-page-t", className)} {...props} />;
}

function NavigationMenuList({
  className,
  ...props
}: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul {...props} className="flex flex-col gap-0.5">
      {props.children}
    </ul>
  );
}

function NavigationMenuItem({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLLIElement>) {
  return (
    <li {...props} className="flex">
      {children}
    </li>
  );
}

function NavigationMenuLink({ children, ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className="text-fg-3 transition-colors duration-200 hover:text-fg-2 data-[status=active]:text-fg-1"
    >
      {children}
    </Link>
  );
}

export {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
};
