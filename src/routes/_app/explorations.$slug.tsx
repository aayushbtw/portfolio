import { createFileRoute } from "@tanstack/react-router";

import { Page, PageHeader } from "~/components/ui/page";
import { seo } from "~/lib/seo";
import { formatDate } from "~/lib/utils";
import { getExploration } from "~/server/explorations";

export const Route = createFileRoute("/_app/explorations/$slug")({
  loader: ({ params: { slug } }) => getExploration({ data: slug }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }

    return seo({
      title: loaderData.title,
      description: loaderData.description,
    });
  },
  component: ExplorationPage,
});

function ExplorationPage() {
  const exploration = Route.useLoaderData();

  return (
    <Page variant="compact">
      <PageHeader
        meta={
          <time dateTime={exploration.publishedAt}>
            {formatDate(exploration.publishedAt)}
          </time>
        }
        title={exploration.title}
      />

      {exploration.body}
    </Page>
  );
}
