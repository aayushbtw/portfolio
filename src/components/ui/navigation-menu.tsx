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
    <ul className={cn("relative flex flex-col gap-0.5", className)} {...props}>
      <span
        aria-hidden="true"
        className={cn(
          "absolute size-1.5 -translate-y-1/2 rounded-full",
          "bg-linear-to-br from-brand to-brand/60 shadow-[0_0_8px_rgba(var(--brand-rgb),0.6)]",
          "transition-[top] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "top-[anchor(center)] [position-anchor:--active]"
        )}
      />
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
    <li {...props} className={cn("flex items-center gap-2", className)}>
      <span className="size-1.5" />
      {children}
    </li>
  );
}

function NavigationMenuLink({ children, ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className="text-fg-3 transition-colors duration-200 hover:text-fg-2 data-[status=active]:text-fg-1 data-[status=active]:[anchor-name:--active]"
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
