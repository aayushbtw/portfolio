import { createFileRoute } from "@tanstack/react-router";

import { PostList } from "~/components/post-list";
import { Page } from "~/components/ui/page";
import { seo } from "~/lib/seo";
import { getExplorationList } from "~/server/explorations";

const title = "Explorations";
const description = "React components I built to try out an idea.";

export const Route = createFileRoute("/_app/explorations/")({
  loader: () => getExplorationList(),
  head: () => seo({ title, description }),
  component: ExplorationsPage,
});

function ExplorationsPage() {
  const explorations = Route.useLoaderData();

  return (
    <Page>
      <section>
        <h1>{title}</h1>
        <PostList posts={explorations} to="/explorations/$slug" />
      </section>
    </Page>
  );
}
