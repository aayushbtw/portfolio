import * as stylex from "@stylexjs/stylex";
import { Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { Text } from "~/components/primitives/text";
import { List, ListItem, listStyles } from "~/components/ui/list";
import { allPosts } from "~/lib/content";
import { renderMarkdown } from "~/lib/markdown";
import { formatNumericDate, toUtcDate } from "~/lib/utils";

const styles = stylex.create({
  // Fixed column so the titles start on the same x whether or not the row
  // prints a year.
  year: { width: "3rem" },
  title: { flexGrow: 1, flexShrink: 1, flexBasis: "0%" },
});

function sortedPosts() {
  return allPosts.toSorted(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

function postRows(limit?: number) {
  return sortedPosts()
    .slice(0, limit)
    .map((post) => ({
      year: toUtcDate(post.publishedAt).getUTCFullYear(),
      slug: post.slug,
      title: post.title,
      date: formatNumericDate(post.publishedAt),
    }));
}

function PostList({ limit }: { limit?: number }) {
  const posts = postRows(limit);

  return (
    <List>
      {posts.map((post, i) => {
        const showYear = i === 0 || posts[i - 1].year !== post.year;
        return (
          <ListItem key={post.slug}>
            <Link
              {...stylex.props(listStyles.link)}
              params={{ slug: post.slug }}
              to="/writings/$slug"
            >
              <Text
                as="span"
                numeric="tabular"
                style={styles.year}
                variant="row"
              >
                {showYear ? post.year : ""}
              </Text>
              <Text as="span" style={styles.title} variant="row-title">
                {post.title}
              </Text>
              <Text as="time" numeric="tabular" variant="row">
                {post.date}
              </Text>
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
