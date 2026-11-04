import { createFileRoute } from "@tanstack/react-router";

import { PostList } from "~/components/post-list";
import { Page, PageHeader } from "~/components/ui/page";
import { seo } from "~/lib/seo";
import { formatNumericDate, formatParts } from "~/lib/utils";
import { getSeries } from "~/server/writings";

export const Route = createFileRoute("/_app/series/$slug")({
  loader: async ({ params: { slug } }) => await getSeries({ data: slug }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }

    return seo({
      title: loaderData.title,
      description: `A series in ${formatParts(loaderData.parts.length)}.`,
    });
  },
  component: SeriesPage,
});

function SeriesPage() {
  const series = Route.useLoaderData();

  return (
    <Page variant="compact">
      <PageHeader
        meta={formatParts(series.parts.length)}
        title={series.title}
      />

      <PostList
        posts={series.parts.map(({ part, publishedAt, slug, title }) => ({
          date: formatNumericDate(publishedAt),
          lead: part,
          slug,
          title,
        }))}
      />
    </Page>
  );
}
