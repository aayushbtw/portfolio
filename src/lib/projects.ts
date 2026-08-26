import type { LinkProps } from "@tanstack/react-router";

// `to` is a route on this site, `href` is anywhere else. Exactly one of them,
// so the list row knows whether it leaves the site without sniffing the string.
type Project = {
  description: string;
  name: string;
} & ({ href: string; to?: never } | { href?: never; to: LinkProps["to"] });

const projects: Project[] = [
  {
    name: "Type",
    description: "A minimal typing test built for feel over features.",
    href: "https://type.aayush.cv",
  },
  {
    name: "Octo",
    description: "A small service that proxies the GitHub API.",
    href: "https://github.com/aayushbtw/octo",
  },
  {
    name: "Skills",
    description: "Instructions I hand to coding agents, kept in the open.",
    to: "/skills",
  },
];

export { type Project, projects };
