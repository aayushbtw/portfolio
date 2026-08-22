import { IconArrowUpRight, IconStarFilled } from "@tabler/icons-react";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { Suspense } from "react";
import {
  List,
  ListItem,
  ListItemDescription,
  ListItemHover,
  ListItemTitle,
  ListSkeleton,
} from "~/components/ui/list";
import { fetchPinnedRepos } from "~/lib/octo";

async function ProjectList() {
  let projects: Awaited<ReturnType<typeof fetchPinnedRepos>>;
  try {
    projects = await fetchPinnedRepos();
  } catch {
    return <p className="text-fg-3">Projects are unavailable right now.</p>;
  }

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
