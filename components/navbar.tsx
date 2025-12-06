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
    <header className="flex flex-1 select-none justify-start">
      <nav>
        <ul>
          {links.map((item) => {
            const isActive =
              item.url === "/"
                ? pathname === "/"
                : pathname.startsWith(item.url);

            return (
              <li className="flex" key={item.name}>
                <Link
                  className="inline-flex items-center justify-start gap-x-sm"
                  href={item.url}
                >
                  <div
                    className={cn(
                      "size-1.5 rounded-full transition-all duration-300",
                      isActive
                        ? "translate-x-0 bg-brand opacity-100"
                        : "-translate-x-2 opacity-0"
                    )}
                  />
                  <span
                    className={cn(
                      "leading-7",
                      isActive ? "text-fg-1" : "text-fg-3 hover:text-fg-2"
                    )}
                  >
                    {item.name}
                  </span>
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
