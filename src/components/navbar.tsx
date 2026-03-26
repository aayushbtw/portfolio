import type { LinkProps } from "@tanstack/react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const links: {
  name: string;
  to: LinkProps["to"];
}[] = [
  { name: "Home", to: "/" },
  { name: "Projects", to: "/projects" },
  { name: "Writings", to: "/writings" },
];

function Navbar() {
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          {links.map((item) => {
            return (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink to={item.to}>
                  {item.name}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export { Navbar };
