"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

function NavigationMenu({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <nav className={cn("relative z-10 flex", className)} {...props} />;
}

function NavigationMenuList({
  className,
  ...props
}: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn(
        "relative flex select-none flex-row gap-x-3 md:flex-col",
        className
      )}
      style={{ scrollTargetGroup: "auto" } as React.CSSProperties}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute hidden size-1.5 -translate-y-1/2 rounded-full md:block",
          "bg-linear-to-br from-brand to-brand/60 shadow-[0_0_8px_rgba(var(--brand-rgb),0.6)]",
          "transition-[top] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "top-[anchor(center)] md:[position-anchor:--active]"
        )}
      />
      {props.children}
    </ul>
  );
}

type NavigationMenuItemProps = HTMLAttributes<HTMLLIElement> & {
  active?: boolean;
};

function NavigationMenuItem({
  className,
  active = false,
  ...props
}: NavigationMenuItemProps) {
  return (
    <li
      className={cn("flex items-center justify-start gap-x-sm", className)}
      style={active ? { anchorName: "--active" } : undefined}
      {...props}
    >
      <span className={cn("hidden size-1.5 md:block")} />
      {props.children}
    </li>
  );
}

type NavigationMenuLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  active?: boolean;
  external?: boolean;
};

function NavigationMenuLink({
  className,
  active = false,
  external = false,
  children,
  ...props
}: NavigationMenuLinkProps) {
  return (
    <Link
      className={cn(
        active ? "link text-fg-1 md:no-underline" : "text-fg-3 hover:text-fg-2",
        className
      )}
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      {...props}
    >
      {children}
    </Link>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
};
