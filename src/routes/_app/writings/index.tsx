import { createFileRoute } from "@tanstack/react-router";
import { ListPosts } from "@/components/list-posts";
import { getAllPosts } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";

const title = "Writings";
const description = "Thoughts on software, design and building for the web.";

export const Route = createFileRoute("/_app/writings/")({
  loader: () => {
    const posts = getAllPosts();
    return { posts };
  },
  head: () => ({
    ...pageMeta({ title, description, path: "/writings" }),
  }),
  component: WritingsPage,
});

function WritingsPage() {
  const { posts } = Route.useLoaderData();

  return (
    <>
      <h1 data-title>{title}</h1>
      <ListPosts posts={posts} />
    </>
  );
}
