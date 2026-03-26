import { IconArrowUpRight, IconStarFilled } from "@tabler/icons-react";
import { config } from "@/lib/config";
import type { PinnedRepo } from "@/lib/octo";

function ListProjects({ projects }: { projects: PinnedRepo[] }) {
  return (
    <ul className="group">
      {projects.map((item) => (
        <li className="border-border border-t first:border-t-0" key={item.repo}>
          <a
            className="flex items-center gap-4 py-2 text-fg-3 text-sm transition-opacity hover:opacity-100! group-hover:opacity-40"
            href={`${item.url}?utm_source=${config.domain}`}
            rel="noopener"
            target="_blank"
          >
            <span className="w-22 text-fg-1">{item.repo}</span>
            <span className="max-w-130 flex-1 overflow-hidden">
              {item.description}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-fg-3/50 tabular-nums [&_svg]:size-2.5">
              <IconStarFilled />
              {item.stars}
            </span>
            <IconArrowUpRight className="size-4 text-fg-3/50" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export { ListProjects };
