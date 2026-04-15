import { createFileRoute } from "@tanstack/react-router";
import { ListProjects } from "@/components/list-projects";
import { fetchPinnedRepos } from "@/lib/octo";
import { seo } from "@/lib/seo";
import { getEnv } from "@/lib/server-fns";

export const Route = createFileRoute("/_app/projects")({
  loader: async () => {
    const [projects, env] = await Promise.all([fetchPinnedRepos(), getEnv()]);
    return {
      projects,
      seo: {
        title: "Projects",
        description: "Things I've built across software, design, and the web.",
        domain: env.domain,
      },
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    return seo(loaderData.seo);
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects, seo } = Route.useLoaderData();

  return (
    <section>
      <h1 className="text-fg-3 text-xs uppercase tracking-widest">
        {seo.title}
      </h1>
      <ListProjects projects={projects} />
    </section>
  );
}
