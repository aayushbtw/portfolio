"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

function NavigationMenu({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <nav className={cn("relative z-10 flex", className)} {...props} />;
}

function NavigationMenuList({
  className,
  ...props
}: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn("flex select-none flex-row gap-x-3 md:flex-col", className)}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={cn("flex items-center justify-start gap-x-sm", className)}
      {...props}
    />
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
    <>
      <span
        className={cn(
          "bg-linear-to-br from-brand to-brand/60",
          "hidden size-1.5 rounded-full transition-all md:block",
          active
            ? "scale-100 opacity-100 shadow-[0_0_8px_rgba(var(--brand-rgb),0.6)] duration-200 ease-out"
            : "scale-0 opacity-0 duration-150 ease-in"
        )}
      />
      <Link
        className={cn(
          active
            ? "link text-fg-1 md:no-underline"
            : "text-fg-3 hover:text-fg-2",
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
    </>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
};
