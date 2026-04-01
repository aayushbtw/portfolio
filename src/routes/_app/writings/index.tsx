import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { ListPosts } from "@/components/list-posts";
import { getAllPosts } from "@/lib/blog";
import { seo } from "@/lib/seo";

const title = "Writings";
const description = "Thoughts on software, design and building for the web.";

const routeApi = getRouteApi("/_app/writings/");

function WritingsPage() {
  const { posts } = routeApi.useLoaderData();

  return (
    <section>
      <h1 data-subheading>{title}</h1>
      <ListPosts posts={posts} />
    </section>
  );
}

export const Route = createFileRoute("/_app/writings/")({
  component: WritingsPage,
  head: () => ({
    ...seo({ description, path: "/writings", title }),
  }),
  loader: () => {
    const posts = getAllPosts();
    return { posts };
  },
});
