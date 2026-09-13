import { createServerFn } from "@tanstack/react-start";

import { datedList, loadEntry, writings } from "~/server/content";

// Plain data, not a rendered element: `writings` is local content with no
// latency to stream around and no heavy renderer to keep off the client.
const postListFn = createServerFn({ method: "GET" })
  .validator((limit?: number) => limit)
  .handler(({ data: limit }) => datedList(writings, limit));

const postBySlugFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => loadEntry(writings, slug));

function getPostList(limit?: number) {
  return postListFn({ data: limit });
}

function getPostBySlug(slug: string) {
  return postBySlugFn({ data: slug });
}

export { getPostBySlug, getPostList };
