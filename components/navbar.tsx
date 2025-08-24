"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const links = [
    { name: "Crafts", url: "/crafts" },
    { name: "Writings", url: "/writings" },
  ];
  const pathname = usePathname();
  return (
    <header className="max-w-2xl mx-auto px-4 pt-20 pb-10">
      <nav
        className="flex justify-between text-base"
        aria-label="main-navigation"
      >
        <Link href="/" className="text-muted-foreground font-bold">
          A.
        </Link>

        <ul className="text-foreground/40 font-medium flex gap-4">
          {links.map((item) => (
            <li key={item.name}>
              <Link
                href={item.url}
                className={cn(
                  "transition-colors duration-300",
                  pathname.startsWith(item.url)
                    ? "text-muted-foreground/80"
                    : "hover:text-muted-foreground/80",
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export { Navbar };
