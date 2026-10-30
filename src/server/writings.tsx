import { createServerFn } from "@tanstack/react-start";
import { writings } from "tomekit/content";

import { listDocuments, renderDocument } from "~/server/content";

// Parts are numbered 1 to n with no repeats or gaps; tomekit.config.ts fails
// the build otherwise.
function seriesParts(title: string) {
  return writings
    .documents()
    .flatMap(({ metadata, slug }) =>
      metadata.series?.title === title
        ? [{ part: metadata.series.part, slug, title: metadata.title }]
        : []
    )
    .toSorted((a, b) => a.part - b.part);
}

function seriesView({ part, title }: { part: number; title: string }) {
  const parts = seriesParts(title);

  return {
    next: parts.find((p) => p.part === part + 1),
    part,
    parts,
    previous: parts.find((p) => p.part === part - 1),
    title,
  };
}

type Series = ReturnType<typeof seriesView>;

const getWritings = createServerFn({ method: "GET" }).handler(() =>
  listDocuments(writings)
    .filter((post) => (post.series?.part ?? 1) === 1)
    .map(({ series, ...post }) => ({
      ...post,
      series: series && {
        parts: seriesParts(series.title).length,
        title: series.title,
      },
    }))
);

const getWriting = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const post = await renderDocument(writings, slug);

    return { ...post, series: post.series && seriesView(post.series) };
  });

export { getWriting, getWritings, type Series };
