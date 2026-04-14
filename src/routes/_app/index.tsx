import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { ListPosts } from "@/components/list-posts";
import { ListProjects } from "@/components/list-projects";
import { ContributionGraph } from "@/components/ui/contribution-graph";
import { getAllPosts } from "@/lib/blog";
import { config } from "@/lib/config";
import { useHaptics } from "@/lib/haptics";
import { fetchContributions, fetchPinnedRepos } from "@/lib/octo";
import { seo } from "@/lib/seo";

const lastYear = new Date().getFullYear() - 1;

export const Route = createFileRoute("/_app/")({
  loader: async () => {
    const [posts, contributions, projects] = await Promise.all([
      getAllPosts(5),
      fetchContributions(lastYear),
      fetchPinnedRepos(),
    ]);
    return { posts, contributions, projects };
  },
  head: () => ({
    ...seo({
      title: config.name,
      description: config.description,
      path: "/",
    }),
  }),
  component: HomePage,
});

function HomePage() {
  const { posts, contributions, projects } = Route.useLoaderData();
  const { trigger } = useHaptics();

  return (
    <>
      <section>
        <h1 className="mb-4">{config.name}</h1>
        <p className="text-fg-3">{config.description}</p>
        <p className="text-fg-3">
          Full-stack engineer at{" "}
          <a
            className="animated-link"
            href={`https://www.netision.com/?utm_source=${config.domain}`}
            onMouseEnter={() => trigger("tick")}
            rel="noopener"
            target="_blank"
          >
            <Image
              alt="netision"
              className="mr-1 mb-0.5 inline-block size-4 rounded"
              height={32}
              src="netision.svg"
              width={32}
            />
            Netision
          </a>
          , building a multi-agent platform.
        </p>
      </section>

      <section className="mt-6">
        <ContributionGraph
          data={contributions.contributions}
          total={contributions.total}
          year={contributions.year}
        />
      </section>

      <section className="mt-6">
        <h2 className="text-fg-3 text-xs uppercase tracking-widest">
          Projects
        </h2>
        <ListProjects projects={projects} />
      </section>

      <section className="mt-6">
        <h2 className="text-fg-3 text-xs uppercase tracking-widest">
          Writings
        </h2>
        <ListPosts className="mt-2" posts={posts} />
      </section>
    </>
  );
}
