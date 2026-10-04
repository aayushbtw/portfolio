import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight";
import * as stylex from "@stylexjs/stylex";

import {
  List,
  ListItem,
  ListItemLeader,
  ListItemLink,
  ListItemMeta,
  ListItemTitle,
} from "~/components/ui/list";
import type { Project } from "~/lib/projects";
import { durations, easings, media } from "~/styles/tokens.stylex";

const styles = stylex.create({
  arrow: {
    display: "inline-flex",
    transitionDuration: durations.popover,
    transitionProperty: "transform",
    transitionTimingFunction: easings.out,
  },
  internal: {
    transform: {
      default: null,
      [media.hover]: {
        default: null,
        [stylex.when.ancestor(":hover")]: "translateX(2px)",
      },
    },
  },
  external: {
    transform: {
      default: null,
      [media.hover]: {
        default: null,
        [stylex.when.ancestor(":hover")]: "translate(1.5px, -1.5px)",
      },
    },
  },
});

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <List>
      {projects.map((item) =>
        item.to ? (
          <ListItemLink key={item.name} to={item.to}>
            <ProjectRow project={item}>
              <span {...stylex.props(styles.arrow, styles.internal)}>
                <ArrowRight aria-hidden="true" size={13} weight="light" />
              </span>
            </ProjectRow>
          </ListItemLink>
        ) : (
          <ListItem
            href={item.href}
            key={item.name}
            rel="noopener"
            target="_blank"
          >
            <ProjectRow project={item}>
              <span {...stylex.props(styles.arrow, styles.external)}>
                <ArrowUpRight aria-hidden="true" size={13} weight="light" />
              </span>
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
      <ListItemTitle>{project.name}</ListItemTitle>
      <ListItemLeader />
      <ListItemMeta>
        {project.tag}
        {children}
      </ListItemMeta>
    </>
  );
}

export { ProjectList };
