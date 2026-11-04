import { createFileRoute } from "@tanstack/react-router";

import { SeriesParts } from "~/components/series";
import { Page, PageHeader } from "~/components/ui/page";
import { seo } from "~/lib/seo";
import { formatDate, formatParts } from "~/lib/utils";
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
  const [{ publishedAt }] = series.parts;

  return (
    <Page variant="compact">
      <PageHeader
        meta={
          <>
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
            {` · ${formatParts(series.parts.length)}`}
          </>
        }
        title={series.title}
      />

      <SeriesParts parts={series.parts} />
    </Page>
  );
}
