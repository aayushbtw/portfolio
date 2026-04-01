import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { GithubGraph } from "@/components/github-graph";
import { ListPosts } from "@/components/list-posts";
import { ListProjects } from "@/components/list-projects";
import { getAllPosts } from "@/lib/blog";
import { config } from "@/lib/config";
import { fetchContributions, fetchPinnedRepos } from "@/lib/octo";
import { seo } from "@/lib/seo";

const lastYear = new Date().getFullYear() - 1;

const routeApi = getRouteApi("/_app/");

function HomePage() {
  const { posts, contributions, projects } = routeApi.useLoaderData();

  return (
    <>
      <section>
        <h1>{config.name}</h1>
        <p>
          {config.description} Full-stack engineer at{" "}
          <a
            href={`https://www.netision.com/?utm_source=${config.domain}`}
            rel="noopener"
            target="_blank"
          >
            Netision
          </a>
          , building a multi-agent platform.
        </p>
      </section>

      <section>
        <GithubGraph data={contributions} />
      </section>

      <section>
        <h2 data-subheading>Projects</h2>
        <ListProjects projects={projects} />
      </section>

      <section>
        <h2 data-subheading>Writings</h2>
        <ListPosts posts={posts} />
      </section>
    </>
  );
}

export const Route = createFileRoute("/_app/")({
  component: HomePage,
  head: () => ({
    ...seo({
      description: config.description,
      path: "/",
      title: config.name,
    }),
  }),
  loader: async () => {
    const [posts, contributions, projects] = await Promise.all([
      getAllPosts(5),
      fetchContributions(lastYear),
      fetchPinnedRepos(),
    ]);
    return { contributions, posts, projects };
  },
});
