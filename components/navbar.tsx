"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function Navbar() {
  const links = [
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
    { name: "Writings", url: "/writings" },
  ];
  const pathname = usePathname();
  return (
    <header>
      <nav>
        <ul className="flex select-none flex-row gap-x-3 md:flex-col">
          {links.map((item) => {
            const isActive =
              item.url === "/"
                ? pathname === "/"
                : pathname.startsWith(item.url);

            return (
              <li
                className="flex items-center justify-start gap-x-sm"
                key={item.name}
              >
                <span
                  className={cn(
                    "bg-linear-to-br from-brand to-brand/60",
                    "hidden size-1.5 rounded-full transition-all md:block",
                    isActive
                      ? "scale-100 opacity-100 shadow-[0_0_8px_rgba(var(--brand-rgb),0.6)] duration-200 ease-out"
                      : "scale-0 opacity-0 duration-150 ease-in"
                  )}
                />
                <Link
                  className={cn(
                    isActive ? "text-fg-1" : "text-fg-3 hover:text-fg-2",
                    isActive ? "link md:no-underline" : ""
                  )}
                  href={item.url}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export { Navbar };
