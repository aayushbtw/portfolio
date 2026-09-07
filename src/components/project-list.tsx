import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight";

import {
  List,
  ListItem,
  ListItemDescription,
  ListItemHover,
  ListItemLink,
  ListItemTitle,
} from "~/components/ui/list";
import type { Project } from "~/lib/projects";

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <List>
      {projects.map((item) =>
        item.to ? (
          <ListItemLink key={item.name} to={item.to}>
            <ProjectRow project={item} />
            <ListItemHover>
              <ArrowRight aria-hidden="true" weight="light" />
            </ListItemHover>
          </ListItemLink>
        ) : (
          <ListItem
            href={item.href}
            key={item.name}
            rel="noopener"
            target="_blank"
          >
            <ProjectRow project={item} />
            <ListItemHover>
              <ArrowUpRight aria-hidden="true" weight="light" />
            </ListItemHover>
          </ListItem>
        )
      )}
    </List>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <div className="flex min-w-0 flex-col">
      <ListItemTitle>{project.name}</ListItemTitle>
      <ListItemDescription>{project.description}</ListItemDescription>
    </div>
  );
}

export { ProjectList };
