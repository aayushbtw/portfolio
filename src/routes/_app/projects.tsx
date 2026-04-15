import { createFileRoute } from "@tanstack/react-router";
import { ListProjects } from "@/components/list-projects";
import { fetchPinnedRepos } from "@/lib/octo";
import { seo } from "@/lib/seo";
import { getEnv } from "@/lib/server-fns";

const title = "Projects";
const description = "Things I've built across software, design, and the web.";

export const Route = createFileRoute("/_app/projects")({
  loader: async () => {
    const [projects, env] = await Promise.all([fetchPinnedRepos(), getEnv()]);
    return { projects, env };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    return seo({ title, description, domain: loaderData.env.domain });
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects } = Route.useLoaderData();

  return (
    <section>
      <h1 className="text-fg-3 text-xs uppercase tracking-widest">{title}</h1>
      <ListProjects projects={projects} />
    </section>
  );
}
