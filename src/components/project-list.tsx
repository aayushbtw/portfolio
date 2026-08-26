import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import {
  List,
  ListItem,
  ListItemDescription,
  ListItemHover,
  ListItemTitle,
} from "~/components/ui/list";
import type { Project } from "~/lib/projects";

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <List>
      {projects.map((item) => (
        <ListItem key={item.name}>
          {item.to ? (
            <Link className="row-link" to={item.to}>
              <ProjectRow project={item} />
              <ListItemHover>
                <IconArrowRight aria-hidden="true" stroke={1.5} />
              </ListItemHover>
            </Link>
          ) : (
            <a
              className="row-link"
              href={item.href}
              rel="noopener"
              target="_blank"
            >
              <ProjectRow project={item} />
              <ListItemHover>
                <IconArrowUpRight aria-hidden="true" stroke={1.5} />
              </ListItemHover>
            </a>
          )}
        </ListItem>
      ))}
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
