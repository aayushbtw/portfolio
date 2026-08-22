import { IconArrowUpRight, IconStarFilled } from "@tabler/icons-react";
import {
  List,
  ListItem,
  ListItemDescription,
  ListItemHover,
  ListItemTitle,
} from "~/components/ui/list";

// The wire shape octo returns. It lives here rather than beside the fetch
// because this is what consumes it, and a client component should not have to
// import from a server-only module to name its own props.
interface PinnedRepo {
  description: string;
  forks: number;
  language: string;
  repo: string;
  stars: number;
  url: string;
}

function ProjectList({ projects }: { projects: PinnedRepo[] }) {
  return (
    <List>
      {projects.map((item) => (
        <ListItem key={item.repo}>
          <a
            className="row-link"
            href={item.url}
            rel="noopener"
            target="_blank"
          >
            <div className="flex min-w-0 flex-col">
              <ListItemTitle className="capitalize">{item.repo}</ListItemTitle>
              <ListItemDescription>{item.description}</ListItemDescription>
            </div>

            <ListItemHover>
              <div className="inline-flex items-center gap-xs tabular-nums">
                <IconStarFilled aria-hidden="true" className="size-2.5" />
                {item.stars}
              </div>
              <IconArrowUpRight aria-hidden="true" />
            </ListItemHover>
          </a>
        </ListItem>
      ))}
    </List>
  );
}

export { type PinnedRepo, ProjectList };
