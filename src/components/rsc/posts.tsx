import { Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { List, ListItem, ListItemTitle } from "~/components/ui/list";
import { allPosts } from "~/lib/content";
import { renderMarkdown } from "~/lib/markdown";
import { formatNumericDate, toUtcDate } from "~/lib/utils";

function sortedPosts() {
  return allPosts.toSorted(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

function PostList({ limit }: { limit?: number }) {
  const posts = sortedPosts()
    .slice(0, limit)
    .map((post) => ({
      year: toUtcDate(post.publishedAt).getUTCFullYear(),
      slug: post.slug,
      title: post.title,
      date: formatNumericDate(post.publishedAt),
    }));

  return (
    <List>
      {posts.map((post, i) => {
        const showYear = i === 0 || posts[i - 1].year !== post.year;
        return (
          <ListItem key={post.slug}>
            <Link
              className="row-link grid grid-cols-[56px_minmax(0,1fr)_auto]"
              params={{ slug: post.slug }}
              to="/writings/$slug"
            >
              <span className="text-fg-3 tabular-nums">
                {showYear ? post.year : ""}
              </span>
              <ListItemTitle className="flex-1">{post.title}</ListItemTitle>
              <time className="text-fg-3 tabular-nums">{post.date}</time>
            </Link>
          </ListItem>
        );
      })}
    </List>
  );
}

const postListFn = createServerFn({ method: "GET" })
  .inputValidator((limit?: number) => limit)
  .handler(({ data: limit }) =>
    renderServerComponent(<PostList limit={limit} />)
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
