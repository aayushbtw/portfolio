import * as stylex from "@stylexjs/stylex";
import { IconArrowUpRight, IconStarFilled } from "@tabler/icons-react";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { Suspense } from "react";
import { Box } from "~/components/primitives/box";
import { Icon } from "~/components/primitives/icon";
import { Text } from "~/components/primitives/text";
import {
  List as TwList,
  ListItem as TwListItem,
  ListItemHover as TwListItemHover,
  ListSkeleton as TwListSkeleton,
} from "~/components/ui/list";
import {
  List,
  ListItem,
  ListItemHover,
  ListSkeleton,
  listStyles,
} from "~/components/ui/orbit/list";
import { fetchPinnedRepos } from "~/lib/octo";

const styles = stylex.create({
  // Repo names come back lowercased from the API.
  name: { textTransform: "capitalize" },
  skeletonRow: { height: "2.5rem" },
});

async function ProjectListOrbit() {
  let projects: Awaited<ReturnType<typeof fetchPinnedRepos>>;
  try {
    projects = await fetchPinnedRepos();
  } catch {
    return <Text>Projects are unavailable right now.</Text>;
  }

  return (
    <List>
      {projects.map((item) => (
        <ListItem key={item.repo}>
          <a
            {...stylex.props(listStyles.link)}
            href={item.url}
            rel="noopener"
            target="_blank"
          >
            <Box display="flex" flexDirection="column" shrink>
              <Text as="span" color="fg-2" style={styles.name} variant="row">
                {item.repo}
              </Text>
              <Text variant="row">{item.description}</Text>
            </Box>

            <ListItemHover>
              <Box alignItems="center" display="inlineFlex" gap="xs">
                <Icon as={IconStarFilled} color="fg-3" size="sm" />
                <Text as="span" color="fg-3" numeric="tabular" variant="row">
                  {item.stars}
                </Text>
              </Box>
              <Icon as={IconArrowUpRight} color="fg-3" size="md" />
            </ListItemHover>
          </a>
        </ListItem>
      ))}
    </List>
  );
}

/* The Tailwind original, still serving `/projects`. Delete with its exports
   once that route migrates. */
async function ProjectList() {
  let projects: Awaited<ReturnType<typeof fetchPinnedRepos>>;
  try {
    projects = await fetchPinnedRepos();
  } catch {
    return <p className="text-fg-3">Projects are unavailable right now.</p>;
  }

  return (
    <TwList>
      {projects.map((item) => (
        <TwListItem key={item.repo}>
          <a
            className="row-link"
            href={item.url}
            rel="noopener"
            target="_blank"
          >
            <div className="flex min-w-0 flex-col">
              <span className="text-fg-2 capitalize">{item.repo}</span>
              <p>{item.description}</p>
            </div>

            <TwListItemHover>
              <div className="inline-flex items-center gap-xs tabular-nums">
                <IconStarFilled aria-hidden="true" className="size-2.5" />
                {item.stars}
              </div>
              <IconArrowUpRight aria-hidden="true" />
            </TwListItemHover>
          </a>
        </TwListItem>
      ))}
    </TwList>
  );
}

const projectListFn = createServerFn({ method: "GET" }).handler(() =>
  renderServerComponent(
    <Suspense fallback={<TwListSkeleton rowClassName="h-10" rows={4} />}>
      <ProjectList />
    </Suspense>
  )
);

const projectListOrbitFn = createServerFn({ method: "GET" }).handler(() =>
  renderServerComponent(
    <Suspense
      fallback={<ListSkeleton rowStyle={styles.skeletonRow} rows={4} />}
    >
      <ProjectListOrbit />
    </Suspense>
  )
);

function getProjectList() {
  return projectListFn();
}

function getProjectListOrbit() {
  return projectListOrbitFn();
}

export { getProjectList, getProjectListOrbit };
