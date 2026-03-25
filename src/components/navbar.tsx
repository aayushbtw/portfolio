import { useRouterState } from "@tanstack/react-router";
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <NavigationMenu className="py-[1.5em] lg:py-0">
      <NavigationMenuList className="gap-x-[1em]">
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
