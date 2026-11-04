import { createFileRoute } from "@tanstack/react-router";

import { SeriesNav, SeriesPartLink, SeriesParts } from "~/components/series";
import { Page, PageHeader } from "~/components/ui/page";
import { config } from "~/lib/config";
import { seo } from "~/lib/seo";
import { formatDate, formatParts } from "~/lib/utils";
import { getWriting } from "~/server/writings";
import type { Writing } from "~/server/writings";

type Series = Extract<Writing, { kind: "series" }>["series"];

type Post = Extract<Writing, { kind: "post" }>["post"];

export const Route = createFileRoute("/_app/writings/$slug")({
  loader: async ({ params: { slug } }) => await getWriting({ data: slug }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }

    switch (loaderData.kind) {
      case "series": {
        return seriesHead(loaderData.series);
      }
      case "post": {
        return postHead(loaderData.post);
      }
      default: {
        const _exhaustive: never = loaderData;
        return _exhaustive;
      }
    }
  },
  component: WritingRoute,
});

function seriesHead(series: Series) {
  return seo({
    title: series.title,
    description: `A series in ${formatParts(series.parts.length)}.`,
  });
}

function postHead(post: Post) {
  const title = post.series
    ? `${post.series.title}: ${post.title}`
    : post.title;

  return {
    ...seo({
      title,
      description: post.description,
      meta: [
        { property: "og:type", content: "article" },
        { property: "article:author", content: config.name },
        { property: "article:published_time", content: post.publishedAt },
        {
          property: "article:modified_time",
          content: post.modifiedAt ?? post.publishedAt,
        },
      ],
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description: post.description,
          image: `${config.siteUrl}/api/og?title=${encodeURIComponent(title)}`,
          author: { "@type": "Person", name: config.name },
          datePublished: post.publishedAt,
          dateModified: post.modifiedAt ?? post.publishedAt,
        }),
      },
    ],
  };
}

function WritingRoute() {
  const writing = Route.useLoaderData();

  switch (writing.kind) {
    case "series": {
      return <SeriesPage series={writing.series} />;
    }
    case "post": {
      return <WritingPage post={writing.post} />;
    }
    default: {
      const _exhaustive: never = writing;
      return _exhaustive;
    }
  }
}

function SeriesPage({ series }: { series: Series }) {
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

function WritingPage({ post }: { post: Post }) {
  return (
    <Page variant="compact">
      <PageHeader
        meta={
          <>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            {post.series && (
              <>
                {" · "}
                <SeriesPartLink series={post.series} />
              </>
            )}
          </>
        }
        title={post.title}
      />

      {post.body}

      {post.series && (post.series.previous ?? post.series.next) && (
        <SeriesNav series={post.series} />
      )}
    </Page>
  );
}
