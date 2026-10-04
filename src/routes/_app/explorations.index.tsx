import { createFileRoute } from "@tanstack/react-router";

import { PostList, postListItems } from "~/components/post-list";
import { Page, PageHeader } from "~/components/ui/page";
import { seo } from "~/lib/seo";
import { getExplorations } from "~/server/explorations";

const title = "Explorations";

const description = "React components I built to try out an idea.";

export const Route = createFileRoute("/_app/explorations/")({
  loader: async () => postListItems(await getExplorations()),
  head: () => seo({ title, description }),
  component: ExplorationsPage,
});

function ExplorationsPage() {
  const explorations = Route.useLoaderData();

  return (
    <Page variant="compact">
      <PageHeader description={description} title={title} />

      <PostList posts={explorations} to="/explorations/$slug" />
    </Page>
  );
}
