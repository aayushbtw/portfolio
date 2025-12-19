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
              <li className="flex" key={item.name}>
                <Link
                  className={cn(
                    "flex items-center justify-start gap-x-sm",
                    isActive ? "text-fg-1" : "text-fg-3 hover:text-fg-2",
                    isActive ? "link md:no-underline" : ""
                  )}
                  href={item.url}
                >
                  <span
                    className={cn(
                      "hidden size-1.5 rounded-full transition-all duration-300 md:block",
                      isActive
                        ? "translate-x-0 bg-brand opacity-100"
                        : "-translate-x-2 opacity-0"
                    )}
                  />
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
