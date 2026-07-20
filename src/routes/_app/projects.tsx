import { createFileRoute } from "@tanstack/react-router";
import { getProjectList } from "~/components/rsc/projects";
import { seo } from "~/lib/seo";

const title = "Projects";
const description = "Things I've built across software, design, and the web.";

export const Route = createFileRoute("/_app/projects")({
  loader: () => getProjectList(),
  head: () => seo({ title, description }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const projects = Route.useLoaderData();

  return (
    <section>
      <h1 className="text-eyebrow">{title}</h1>
      {projects}
    </section>
  );
}
