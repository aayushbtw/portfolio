import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const links: {
  name: string;
  to: LinkProps["to"];
}[] = [
  { name: "Home", to: "/" },
  { name: "Projects", to: "/projects" },
  { name: "Writings", to: "/writings" },
];

function SideNavbar({ className }: { className?: string }) {
  return (
    <nav className={cn("sticky top-page-t", className)}>
      <ul className="relative flex flex-col gap-0.5">
        <span
          aria-hidden="true"
          className="absolute top-[anchor(center)] size-1.5 -translate-y-1/2 rounded-full bg-linear-to-br from-brand to-brand/60 shadow-[0_0_8px_rgba(var(--brand-rgb),0.6)] transition-[top] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] [position-anchor:--active]"
        />
        {links.map((item) => (
          <li className="flex items-center gap-2" key={item.name}>
            <span className="size-1.5" />
            <Link
              className="text-fg-3 transition-colors duration-200 hover:text-fg-2 data-[status=active]:text-fg-1 data-[status=active]:[anchor-name:--active]"
              data-unstyled
              to={item.to}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FloatingNavbar({ className }: { className?: string }) {
  return (
    <nav className={cn("inset-x-0 bottom-0 z-50 py-floating-nav-p", className)}>
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

function Navbar() {
  return (
    <div>
      <SideNavbar className="hidden lg:block" />
      <FloatingNavbar className="fixed lg:hidden" />
    </div>
  );
}

export { Navbar };
