import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight";

import {
  List,
  ListItem,
  ListItemLeader,
  ListItemLink,
  ListItemMeta,
  ListItemTitle,
} from "~/components/ui/list";
import type { Project } from "~/lib/projects";

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <List>
      {projects.map((item) =>
        item.to ? (
          <ListItemLink
            className="gap-sm rounded-full"
            key={item.name}
            to={item.to}
          >
            <ProjectRow project={item}>
              <ArrowRight aria-hidden="true" weight="light" />
            </ProjectRow>
          </ListItemLink>
        ) : (
          <ListItem
            className="gap-sm rounded-full"
            href={item.href}
            key={item.name}
            rel="noopener"
            target="_blank"
          >
            <ProjectRow project={item}>
              <ArrowUpRight aria-hidden="true" weight="light" />
            </ProjectRow>
          </ListItem>
        )
      )}
    </List>
  );
}

function ProjectRow({
  children,
  project,
}: {
  children: React.ReactNode;
  project: Project;
}) {
  return (
    <>
      <ListItemTitle className="truncate">{project.name}</ListItemTitle>
      <ListItemLeader />
      <ListItemMeta>
        {project.tag}
        {children}
      </ListItemMeta>
    </>
  );
}

export { ProjectList };
