import "@tanstack/react-start/server-only";
import { notFound } from "@tanstack/react-router";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import type { Collection } from "tomekit";
import { collections } from "tomekit/content";

import type { PostListItem } from "~/components/post-list";
import { formatNumericDate, toUtcDate } from "~/lib/utils";
import { renderMarkdown } from "~/server/markdown";

function datedList<
  TDocument extends {
    metadata: { publishedAt: string; title: string };
    slug: string;
  },
>(collection: Collection<TDocument>, limit?: number): PostListItem[] {
  // Calendar-day strings sort chronologically as text.
  return collection
    .documents()
    .toSorted((a, b) =>
      b.metadata.publishedAt.localeCompare(a.metadata.publishedAt)
    )
    .slice(0, limit)
    .map(({ metadata, slug }) => ({
      date: formatNumericDate(metadata.publishedAt),
      slug,
      title: metadata.title,
      year: toUtcDate(metadata.publishedAt).getUTCFullYear(),
    }));
}

// The document itself never leaves the server: callers get the rendered body.
async function loadEntry<TMetadata extends object>(
  collection: Collection<{
    body: Parameters<typeof renderMarkdown>[0];
    metadata: TMetadata;
    slug: string;
  }>,
  slug: string
) {
  const entry = collection.get(slug);
  if (!entry) {
    throw notFound();
  }

  return {
    ...entry.metadata,
    body: await renderServerComponent(renderMarkdown(entry.body)),
    slug: entry.slug,
  };
}

const explorations = collections.get("explorations");
const skills = collections.get("skills");
const writings = collections.get("writings");

export { datedList, explorations, loadEntry, skills, writings };
