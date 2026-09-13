import "@tanstack/react-start/server-only";
import { notFound } from "@tanstack/react-router";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import type { CollectionQuery } from "tomekit";
import { content } from "tomekit/content";

import type { PostListItem } from "~/components/post-list";
import { formatNumericDate, toUtcDate } from "~/lib/utils";
import { renderMarkdown } from "~/server/markdown";

const { explorations, skills, writings } = content;

function datedList<
  TEntry extends { publishedAt: string; slug: string; title: string },
>(collection: CollectionQuery<TEntry>, limit?: number): PostListItem[] {
  // Calendar-day strings sort chronologically as text.
  return collection
    .findMany({ orderBy: { publishedAt: "desc" }, take: limit })
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
>(collection: CollectionQuery<TEntry>, slug: string) {
  const entry = collection.findUnique({ slug });
  if (!entry) {
    throw notFound();
  }

  const { document, ...meta } = entry;

  return {
    ...meta,
    body: await renderServerComponent(renderMarkdown(document)),
  };
}

export { datedList, explorations, loadEntry, skills, writings };
