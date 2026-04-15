import { createFileRoute } from "@tanstack/react-router";
import { ListPosts } from "@/components/list-posts";
import { getAllPosts } from "@/lib/blog";
import { seo } from "@/lib/seo";
import { getEnv } from "@/lib/server-fns";

const title = "Writings";
const description = "Thoughts on software, design and building for the web.";

export const Route = createFileRoute("/_app/writings/")({
  loader: async () => {
    const [posts, env] = await Promise.all([getAllPosts(), getEnv()]);
    return { posts, env };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    return seo({ title, description, domain: loaderData.env.domain });
  },
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
