import { cn } from "~/lib/utils";

function NavListIndicator() {
  return (
    <span
      aria-hidden="true"
      className="indicator-spring indicator-brand top-[anchor(center)] h-2 w-0.5 -translate-y-1/2 [position-anchor:--active]"
    />
  );
}

export function NavList({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "not-typeset relative flex flex-col gap-xs [&_a]:no-underline",
        className
      )}
      data-slot="nav-list"
      {...props}
    >
      <NavListIndicator />
      {children}
    </ul>
  );
}
