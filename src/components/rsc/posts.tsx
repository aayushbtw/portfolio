import { Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { allPosts } from "content-collections";
import { List, ListItem } from "~/components/ui/list";
import {
  Showcase,
  ShowcaseCaption,
  ShowcaseImage,
} from "~/components/ui/showcase";
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
              className="row-link"
              params={{ slug: post.slug }}
              to="/writings/$slug"
            >
              <span className="w-12 tabular-nums">
                {showYear ? post.year : ""}
              </span>
              <span className="flex-1 text-fg-2">{post.title}</span>
              <time className="tabular-nums">{post.date}</time>
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

    const MDXContent = post.mdx;

    return {
      ...post,
      mdx: await renderServerComponent(
        <MDXContent components={{ Showcase, ShowcaseImage, ShowcaseCaption }} />
      ),
    };
  });

function getPostList(limit?: number) {
  return postListFn({ data: limit });
}

function getPostBySlug(slug: string) {
  return postBySlugFn({ data: slug });
}

export { getPostBySlug, getPostList };
