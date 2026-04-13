import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function NavList({
  children,
  className,
  indicator,
}: {
  children: ReactNode;
  className?: string;
  indicator: ReactNode;
}) {
  return (
    <ul className={cn("relative flex flex-col gap-0.5", className)}>
      {indicator}
      {children}
    </ul>
  );
}

export function NavListIndicator({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "indicator-spring indicator-brand shadow-[0_0_8px_rgba(var(--brand-rgb),0.4)] [position-anchor:--active]",
        className
      )}
    />
  );
}
