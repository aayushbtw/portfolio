import { createFileRoute } from "@tanstack/react-router";
import { ListPosts } from "@/components/list-posts";
import { getAllPosts } from "@/lib/posts";
import { seo } from "@/lib/seo";

const title = "Writings";
const description = "Thoughts on software, design and building for the web.";

export const Route = createFileRoute("/_app/writings/")({
  loader: async () => ({ posts: await getAllPosts() }),
  head: () => seo({ title, description }),
  component: WritingsPage,
});

function WritingsPage() {
  const { posts } = Route.useLoaderData();

  return (
    <section>
      <h1 className="text-fg-3 text-xs uppercase tracking-widest">{title}</h1>
      <ListPosts className="mt-2" posts={posts} />
    </section>
  );
}
