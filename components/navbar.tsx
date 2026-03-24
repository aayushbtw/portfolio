"use client";

import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

interface NavLink {
  external?: boolean;
  name: string;
  url: string;
}

function Navbar({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <NavigationMenu className="py-6 lg:py-0">
      <NavigationMenuList>
        {links.map((item) => {
          const isActive =
            item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);

          return (
            <NavigationMenuItem active={isActive} key={item.name}>
              <NavigationMenuLink
                active={isActive}
                external={item.external}
                href={item.url}
              >
                {item.name}
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export { Navbar };
