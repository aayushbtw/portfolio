import { createFileRoute } from "@tanstack/react-router";

import { ListProjects } from "@/components/list-projects";
import { fetchPinnedRepos } from "@/lib/octo";
import { seo } from "@/lib/seo";

const title = "Projects";
const description =
  "Things I've built — full-stack apps, tools, and experiments.";

export const Route = createFileRoute("/_app/projects")({
  component: ProjectsPage,
  head: () => ({
    ...seo({ title, description, path: "/projects" }),
  }),
  loader: () => fetchPinnedRepos(),
});

function ProjectsPage() {
  const projects = Route.useLoaderData();

  return (
    <section>
      <h1 data-subheading>{title}</h1>
      <ListProjects projects={projects} />
    </section>
  );
}
