import { IconArrowUpRight, IconStarFilled } from "@tabler/icons-react";
import { config } from "@/lib/config";
import type { PinnedRepo } from "@/lib/octo";
import { cn } from "@/lib/utils";

function ListProjects({
  projects,
  className,
}: {
  projects: PinnedRepo[];
  className?: string;
}) {
  return (
    <ul className={cn("text-fg-3 leading-5", className)}>
      {projects.map((item) => (
        <li
          className="group/a -mx-3 rounded-md py-1.5 pr-4 pl-3 transition-colors duration-150 hover:bg-bg-2"
          key={item.repo}
        >
          <a
            className="flex items-center gap-4"
            href={`${item.url}?utm_source=${config.domain}`}
            rel="noopener"
            target="_blank"
          >
            <div className="flex flex-col">
              <h6 className="text-fg-2 capitalize">{item.repo}</h6>
              <p>{item.description}</p>
            </div>

            <div className="ml-auto opacity-0 transition-opacity duration-150 group-hover/a:opacity-100">
              <div className="inline-flex items-center gap-1 text-fg-3/50 tabular-nums">
                <IconStarFilled className="size-2.5" />
                {item.stars}
              </div>
            </div>
            <IconArrowUpRight className="size-4 text-fg-3/50 opacity-0 transition-opacity duration-150 group-hover/a:opacity-100" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export { ListProjects };
