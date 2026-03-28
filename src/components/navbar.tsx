import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { NavList, NavListIndicator } from "@/components/nav-list";
import { cn } from "@/lib/utils";

const links: {
  name: string;
  to: LinkProps["to"];
}[] = [
  { name: "Home", to: "/" },
  { name: "Projects", to: "/projects" },
  { name: "Writings", to: "/writings" },
];

export function SideNavbar() {
  return (
    <nav>
      <NavList
        indicator={
          <NavListIndicator className="top-[anchor(center)] h-2 w-0.5 -translate-y-1/2" />
        }
      >
        {links.map((item) => (
          <li key={item.name}>
            <Link className="nav-link" data-unstyled to={item.to}>
              {item.name}
            </Link>
          </li>
        ))}
      </NavList>
    </nav>
  );
}

export function FloatingNavbar({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 py-floating-nav-p lg:hidden",
        className
      )}
    >
      <div className="flex justify-center px-4">
        <div className="flex h-floating-nav-h items-center gap-1 rounded-full border border-border/50 bg-bg-1/50 px-2 py-1.5 shadow-sm backdrop-blur-xs">
          {links.map((item) => (
            <Link
              className="group relative rounded-full px-4 py-1.5 font-medium text-fg-3 text-sm transition-colors duration-200 hover:text-fg-2 data-[status=active]:text-fg-1"
              data-unstyled
              key={item.name}
              to={item.to}
            >
              {item.name}
              <span className="absolute inset-x-3 -bottom-0.5 mx-auto h-0.5 scale-x-0 rounded-full bg-brand opacity-0 transition-[scale,opacity] duration-300 group-data-[status=active]:scale-x-100 group-data-[status=active]:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
