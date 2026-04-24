import { IconArrowUpRight, IconStarFilled } from "@tabler/icons-react";
import type { PinnedRepo } from "~/lib/octo";
import { List, ListItem, ListItemHover } from "./ui/list";

function ListProjects({ projects }: { projects: PinnedRepo[] }) {
  return (
    <List className="mt-2">
      {projects.map((item) => (
        <ListItem key={item.repo}>
          <a
            className="flex items-center gap-4"
            href={item.url}
            rel="noopener"
            target="_blank"
          >
            <div className="flex flex-col">
              <h6 className="text-fg-2 capitalize">{item.repo}</h6>
              <p>{item.description}</p>
            </div>

            <ListItemHover>
              <div className="inline-flex items-center gap-1 tabular-nums">
                <IconStarFilled className="size-2.5" />
                {item.stars}
              </div>
              <IconArrowUpRight />
            </ListItemHover>
          </a>
        </ListItem>
      ))}
    </List>
  );
}

export { ListProjects };
