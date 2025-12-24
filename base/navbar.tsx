"use client";

import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/base/ui/navigation-menu";

type NavLink = {
  name: string;
  url: string;
  external?: boolean;
};

function Navbar({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <NavigationMenu>
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
