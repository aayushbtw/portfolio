import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import type { PostListItem } from "~/components/post-list";
import { formatNumericDate, toUtcDate } from "~/lib/utils";
import { allPosts } from "~/server/content";
import { renderMarkdown } from "~/server/markdown";

function sortedPosts() {
  return allPosts.toSorted(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Plain data, not a rendered element: `allPosts` is local content with no
// latency to stream around and no heavy renderer to keep off the client.
const postListFn = createServerFn({ method: "GET" })
  .inputValidator((limit?: number) => limit)
  .handler(({ data: limit }): PostListItem[] =>
    sortedPosts()
      .slice(0, limit)
      .map((post) => ({
        year: toUtcDate(post.publishedAt).getUTCFullYear(),
        slug: post.slug,
        title: post.title,
        date: formatNumericDate(post.publishedAt),
      }))
  );

const postBySlugFn = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const post = allPosts.find((p) => p.slug === slug);
    if (!post) {
      throw notFound();
    }

    const { document, ...meta } = post;

    return {
      ...meta,
      headings: (document.headings ?? []).filter((h) => h.level === 2),
      body: await renderServerComponent(renderMarkdown(document)),
    };
  });

function getPostList(limit?: number) {
  return postListFn({ data: limit });
}

function getPostBySlug(slug: string) {
  return postBySlugFn({ data: slug });
}

export { getPostBySlug, getPostList };
