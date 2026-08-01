import { createFileRoute } from "@tanstack/react-router";
import { getProjectList } from "~/components/rsc/projects";
import { PageHeader } from "~/components/ui/page-header";
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
      <PageHeader title={title} />
      {projects}
    </section>
  );
}
