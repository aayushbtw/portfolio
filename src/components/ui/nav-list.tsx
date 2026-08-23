import { cn } from "~/lib/utils";

/* Column-only: it tracks the active link's vertical centre, which the wrapped
   row below `lg` has no equivalent of. There the active colour carries it. */
function NavListIndicator() {
  return (
    <span
      aria-hidden="true"
      className="indicator-brand absolute start-0 top-[anchor(center)] hidden h-2 w-0.5 -translate-y-1/2 rounded-full transition-[top] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] [position-anchor:--active] lg:block"
    />
  );
}

function NavList({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "not-typeset relative flex flex-wrap gap-md lg:flex-col lg:gap-xs [&_a]:no-underline",
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

export { NavList };
