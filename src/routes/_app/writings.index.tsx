import { createFileRoute } from "@tanstack/react-router";
import { getPostList } from "~/components/rsc/writings";
import { seo } from "~/lib/seo";

const title = "Writings";
const description = "Thoughts on software, design and building for the web.";

export const Route = createFileRoute("/_app/writings/")({
  loader: () => getPostList(),
  head: () => seo({ title, description }),
  component: WritingsPage,
});

function WritingsPage() {
  const posts = Route.useLoaderData();

  return (
    <section>
      <h1 className="text-eyebrow">{title}</h1>
      {posts}
    </section>
  );
}
