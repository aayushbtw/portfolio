import { cn } from "~/lib/utils";

function NavListIndicator() {
  return (
    <span
      aria-hidden="true"
      className="indicator-brand absolute top-[anchor(center)] left-0 h-2 w-0.5 -translate-y-1/2 rounded-full transition-[top] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] [position-anchor:--active]"
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
