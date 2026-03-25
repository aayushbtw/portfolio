import { createFileRoute } from "@tanstack/react-router";
import { GithubGraph } from "@/components/github-graph";
import { ListPosts } from "@/components/list-posts";
import { ListProjects } from "@/components/list-projects";
import { getAllPosts } from "@/lib/blog";
import { config } from "@/lib/config";
import { fetchContributions, fetchPinnedRepos } from "@/lib/octo";
import { pageMeta } from "@/lib/seo";

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
    ...pageMeta({
      title: config.name,
      description: config.description,
      path: "/",
    }),
  }),
  component: HomePage,
});

function HomePage() {
  const { posts, contributions, projects } = Route.useLoaderData();

  return (
    <>
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
        .
      </p>

      <GithubGraph data={contributions} />

      <h3 data-title>Projects</h3>
      <ListProjects projects={projects} />

      <h3 data-title>Writings</h3>
      <ListPosts posts={posts} />
    </>
  );
}
