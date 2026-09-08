import { createServerFn } from "@tanstack/react-start";

import type { PostListItem } from "~/components/post-list";
import { formatNumericDate, toUtcDate } from "~/lib/utils";
import { allPosts, loadEntry } from "~/server/content";

function sortedPosts() {
  return allPosts.toSorted(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Plain data, not a rendered element: `allPosts` is local content with no
// latency to stream around and no heavy renderer to keep off the client.
const postListFn = createServerFn({ method: "GET" })
  .validator((limit?: number) => limit)
  .handler(({ data: limit }): PostListItem[] =>
    sortedPosts()
      .slice(0, limit)
      .map((post) => ({
        date: formatNumericDate(post.publishedAt),
        slug: post.slug,
        title: post.title,
        year: toUtcDate(post.publishedAt).getUTCFullYear(),
      }))
  );

const postBySlugFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => loadEntry(allPosts, slug));

function getPostList(limit?: number) {
  return postListFn({ data: limit });
}

function getPostBySlug(slug: string) {
  return postBySlugFn({ data: slug });
}

export { getPostBySlug, getPostList };
