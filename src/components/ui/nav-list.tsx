import { cn } from "@/lib/utils";

function NavListIndicator() {
  return (
    <span
      aria-hidden="true"
      className="indicator-spring indicator-brand top-[anchor(center)] h-2 w-0.5 -translate-y-1/2 shadow-[0_0_8px_rgba(var(--brand-rgb),0.4)] [position-anchor:--active]"
    />
  );
}

export function NavList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul className={cn("relative flex flex-col gap-0.5", className)} {...props}>
      <NavListIndicator />
      {props.children}
    </ul>
  );
}
