import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight";

import {
  List,
  ListItem,
  ListItemLink,
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
      <span
        aria-hidden="true"
        className="bg-bg-2 group-hover/list-item:bg-border h-px min-w-md flex-1 transition-colors duration-150 ease-out"
      />
      <span className="gap-xs text-fg-3 flex shrink-0 items-center text-sm [&_svg]:size-[0.9em]">
        {project.tag}
        {children}
      </span>
    </>
  );
}

export { ProjectList };
