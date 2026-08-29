import { createFileRoute } from "@tanstack/react-router";

import { PostList } from "~/components/post-list";
import { Page } from "~/components/ui/page";
import { seo } from "~/lib/seo";
import { getPostList } from "~/server/posts";

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
    <Page>
      <section>
        <h1>{title}</h1>
        <PostList posts={posts} />
      </section>
    </Page>
  );
}
