import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { ListProjects } from "@/components/list-projects";
import { fetchPinnedRepos } from "@/lib/octo";
import { seo } from "@/lib/seo";

const title = "Projects";
const description =
  "Things I've built — full-stack apps, tools, and experiments.";

const routeApi = getRouteApi("/_app/projects");

function ProjectsPage() {
  const projects = routeApi.useLoaderData();

  return (
    <section>
      <h1 data-subheading>{title}</h1>
      <ListProjects projects={projects} />
    </section>
  );
}

export const Route = createFileRoute("/_app/projects")({
  component: ProjectsPage,
  head: () => ({
    ...seo({ description, path: "/projects", title }),
  }),
  loader: () => fetchPinnedRepos(),
});
