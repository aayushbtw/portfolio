import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { writings } from "tomekit/content";

import { listDocuments, renderDocument } from "~/server/content";

interface SeriesPart {
  description: string;
  part: number;
  publishedAt: string;
  slug: string;
  title: string;
}

interface Series {
  parts: SeriesPart[];
  slug: string;
  title: string;
}

// Parts are numbered 1 to n with no repeats or gaps; tomekit.config.ts fails
// the build otherwise.
function seriesNamed(title: string): Series {
  return {
    parts: writings
      .documents()
      .flatMap(({ metadata, slug }) =>
        metadata.series?.title === title
          ? [
              {
                description: metadata.description,
                part: metadata.series.part,
                publishedAt: metadata.publishedAt,
                slug,
                title: metadata.title,
              },
            ]
          : []
      )
      .toSorted((a, b) => a.part - b.part),
    slug: title
      .toLowerCase()
      .split(/[^a-z0-9]+/u)
      .filter(Boolean)
      .join("-"),
    title,
  };
}

function allSeries(): Series[] {
  const titles = new Set(
    writings
      .documents()
      .flatMap(({ metadata }) =>
        metadata.series ? [metadata.series.title] : []
      )
  );

  return [...titles].map(seriesNamed);
}

function seriesPosition({ part, title }: { part: number; title: string }) {
  const series = seriesNamed(title);

  return {
    ...series,
    next: series.parts.find((p) => p.part === part + 1),
    part,
    previous: series.parts.find((p) => p.part === part - 1),
  };
}

type SeriesPosition = ReturnType<typeof seriesPosition>;

const getWritings = createServerFn({ method: "GET" }).handler(() => [
  ...listDocuments(writings).filter(({ series }) => series === undefined),
  ...allSeries().map(({ parts, slug, title }) => ({
    parts: parts.length,
    publishedAt: parts[0].publishedAt,
    slug,
    title,
  })),
]);

const getWriting = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const post = await renderDocument(writings, slug);

    return { ...post, series: post.series && seriesPosition(post.series) };
  });

const getSeries = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const series = allSeries().find((s) => s.slug === slug);

    if (!series) {
      throw notFound();
    }

    return series;
  });

export { allSeries, getSeries, getWriting, getWritings, type SeriesPosition };
