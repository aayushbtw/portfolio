import { IconArrowUpRight, IconStarFilled } from "@tabler/icons-react";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { Suspense } from "react";
import {
  List,
  ListItem,
  ListItemHover,
  ListSkeleton,
} from "~/components/ui/list";
import { fetchPinnedRepos } from "~/lib/octo";

async function ProjectList() {
  const projects = await fetchPinnedRepos();

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
            <div className="flex flex-col">
              <span className="text-fg-2 capitalize">{item.repo}</span>
              <p>{item.description}</p>
            </div>

            <ListItemHover>
              <div className="inline-flex items-center gap-xs tabular-nums">
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

const projectListFn = createServerFn({ method: "GET" }).handler(() =>
  renderServerComponent(
    <Suspense fallback={<ListSkeleton rowClassName="h-10" rows={4} />}>
      <ProjectList />
    </Suspense>
  )
);

function getProjectList() {
  return projectListFn();
}

export { getProjectList };
