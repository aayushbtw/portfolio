import { createServerFn } from "@tanstack/react-start";

import { datedList, explorations, loadEntry } from "~/server/content";

// Plain data, not a rendered element. See the note in server/posts.tsx.
const explorationListFn = createServerFn({ method: "GET" })
  .validator((limit?: number) => limit)
  .handler(({ data: limit }) => datedList(explorations, limit));

const explorationBySlugFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => loadEntry(explorations, slug));

function getExplorationList(limit?: number) {
  return explorationListFn({ data: limit });
}

function getExplorationBySlug(slug: string) {
  return explorationBySlugFn({ data: slug });
}

export { getExplorationBySlug, getExplorationList };
