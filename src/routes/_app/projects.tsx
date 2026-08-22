import { Await, createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/page-header";
import { ProjectList } from "~/components/project-list";
import { ListSkeleton } from "~/components/ui/list";
import { seo } from "~/lib/seo";
import { getProjectList } from "~/server/octo";

const title = "Projects";
const description = "Things I’ve built across software, design, and the web.";

export const Route = createFileRoute("/_app/projects")({
  // Not awaited: the promise is handed to the client and streamed in. The page
  // paints with a skeleton instead of waiting on octo.
  loader: () => ({ projects: getProjectList() }),
  head: () => seo({ title, description }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects } = Route.useLoaderData();

  return (
    <section>
      <PageHeader title={title} />
      <Await
        fallback={<ListSkeleton rowClassName="h-10" rows={4} />}
        promise={projects}
      >
        {(list) =>
          list ? (
            <ProjectList projects={list} />
          ) : (
            <p className="text-fg-3">Projects are unavailable right now.</p>
          )
        }
      </Await>
    </section>
  );
}
