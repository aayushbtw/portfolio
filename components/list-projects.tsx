import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { config } from "@/lib/config";

const projects = [
  {
    name: "Monit",
    description: "Monitor server stats via ssh",
    url: "https://github.com/aayushbtw/monit",
  },
  {
    name: "Z",
    description: "Encode & decode strings through CLI",
    url: "https://github.com/aayushbtw/z",
  },
  {
    name: "TT",
    description: "CLI based typing test",
    url: "https://github.com/aayushbtw/tt",
  },
  {
    name: "Time",
    description: "Year progress bar with precision",
    url: "https://github.com/aayushbtw/time",
  },
];

function ListProjects() {
  return (
    <ul className="group">
      {projects.map((item) => (
        <li
          className="m-0! border-border border-t first:border-t-0"
          key={item.name}
        >
          <Link
            className="flex items-center gap-4 py-2.5 text-sm transition-opacity hover:opacity-100! group-hover:opacity-40"
            href={`${item.url}?utm_source=${config.domain}`}
            rel="noopener"
            target="_blank"
          >
            <span className="w-22">{item.name}</span>
            <span className="flex-1 text-fg-3">{item.description}</span>
            <IconArrowUpRight className="size-4 text-fg-3" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export { ListProjects };
