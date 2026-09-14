import { createFileRoute } from "@tanstack/react-router";

import { PostList, postListItems } from "~/components/post-list";
import { Page } from "~/components/ui/page";
import { seo } from "~/lib/seo";
import { getWritings } from "~/server/writings";

const title = "Writings";
const description = "Thoughts on software, design and building for the web.";

export const Route = createFileRoute("/_app/writings/")({
  loader: async () => postListItems(await getWritings()),
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
