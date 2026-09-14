import "@tanstack/react-start/server-only";
import { notFound } from "@tanstack/react-router";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import type { Collection } from "tomekit";

import type { PostListItem } from "~/components/post-list";
import { formatNumericDate, toUtcDate } from "~/lib/utils";
import { renderMarkdown } from "~/server/markdown";

function datedList<
  TEntry extends { publishedAt: string; slug: string; title: string },
>(collection: Collection<TEntry>, limit?: number): PostListItem[] {
  // Calendar-day strings sort chronologically as text.
  return collection.all
    .toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit)
    .map((entry) => ({
      date: formatNumericDate(entry.publishedAt),
      slug: entry.slug,
      title: entry.title,
      year: toUtcDate(entry.publishedAt).getUTCFullYear(),
    }));
}

// The document itself never leaves the server: callers get the rendered body.
async function loadEntry<
  TEntry extends {
    document: Parameters<typeof renderMarkdown>[0];
    slug: string;
  },
>(collection: Collection<TEntry>, slug: string) {
  const entry = collection.get(slug);
  if (!entry) {
    throw notFound();
  }

  const { document, ...meta } = entry;

  return {
    ...meta,
    body: await renderServerComponent(renderMarkdown(document)),
  };
}

export { datedList, loadEntry };
export { default as explorations } from "tomekit/content/explorations";
export { default as skills } from "tomekit/content/skills";
export { default as writings } from "tomekit/content/writings";
