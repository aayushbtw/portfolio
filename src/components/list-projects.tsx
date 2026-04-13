import { IconArrowUpRight, IconStarFilled } from "@tabler/icons-react";
import { config } from "@/lib/config";
import type { PinnedRepo } from "@/lib/octo";

function ListProjects({ projects }: { projects: PinnedRepo[] }) {
  return (
    <ul className="leading-5!">
      {projects.map((item) => (
        <li
          className="group/a -mx-3 rounded-md py-1.5 pr-4 pl-3 text-fg-3 transition-colors duration-150 hover:bg-bg-2"
          key={item.repo}
        >
          <a
            className="flex items-center gap-4"
            data-unstyled
            href={`${item.url}?utm_source=${config.domain}`}
            rel="noopener"
            target="_blank"
          >
            <div className="flex flex-col">
              <h6 className="my-0 text-fg-2 capitalize">{item.repo}</h6>
              <p className="my-0 overflow-hidden">{item.description}</p>
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
