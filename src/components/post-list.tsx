import * as stylex from "@stylexjs/stylex";

import { List, ListItemLink, ListItemTitle } from "~/components/ui/list";
import { formatNumericDate, toUtcDate } from "~/lib/utils";
import { fontSizes, space } from "~/styles/tokens.stylex";

const styles = stylex.create({
  row: {
    display: "grid",
    gap: space.md,
    gridTemplateColumns: "56px minmax(0, 1fr) auto",
  },
  figure: {
    fontSize: fontSizes.sm,
    fontVariantNumeric: "tabular-nums",
  },
});

interface PostListItem {
  date: string;
  slug: string;
  title: string;
  year: number;
}

interface DatedDocument {
  publishedAt: string;
  slug: string;
  title: string;
}

function postListItems(documents: readonly DatedDocument[]): PostListItem[] {
  // Calendar-day strings sort chronologically as text.
  return documents
    .toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(({ publishedAt, slug, title }) => ({
      date: formatNumericDate(publishedAt),
      slug,
      title,
      year: toUtcDate(publishedAt).getUTCFullYear(),
    }));
}

function PostList({
  posts,
  to = "/writings/$slug",
}: {
  posts: PostListItem[];
  to?: "/writings/$slug" | "/explorations/$slug";
}) {
  return (
    <List>
      {posts.map((post, i) => {
        // Once per run, so a span of two years reads as two groups.
        const showYear = i === 0 || posts[i - 1].year !== post.year;

        return (
          <ListItemLink
            key={post.slug}
            params={{ slug: post.slug }}
            style={styles.row}
            to={to}
          >
            <span {...stylex.props(styles.figure)}>
              {showYear ? post.year : ""}
            </span>
            <ListItemTitle>{post.title}</ListItemTitle>
            <time {...stylex.props(styles.figure)}>{post.date}</time>
          </ListItemLink>
        );
      })}
    </List>
  );
}

export { PostList, type PostListItem, postListItems };
