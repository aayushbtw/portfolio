import type { LinkProps } from "@tanstack/react-router";

// `to` is a route on this site, `href` is anywhere else. Exactly one of them,
// so the list row knows whether it leaves the site without sniffing the string.
type Project = {
  name: string;
  tag: string;
} & ({ href: string; to?: never } | { href?: never; to: LinkProps["to"] });

const projects: Project[] = [
  {
    href: "https://constella.aayush.cv",
    name: "Constella",
    tag: "UI components",
  },
  {
    href: "https://tomekit.aayush.cv",
    name: "Tomekit",
    tag: "Content collections",
  },
  {
    href: "https://github.com/aayushbtw/orbit",
    name: "Orbit",
    tag: "Claude Code plugin",
  },
  {
    href: "https://github.com/aayushbtw/octo",
    name: "Octo",
    tag: "GitHub proxy",
  },
  {
    name: "Skills",
    tag: "Agent instructions",
    to: "/skills",
  },
];

export { type Project, projects };
