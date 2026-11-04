import { StackIcon } from "@phosphor-icons/react/Stack";
import * as stylex from "@stylexjs/stylex";

import { List, ListItemLink, ListItemTitle } from "~/components/ui/list";
import { formatNumericDate, formatParts, toUtcDate } from "~/lib/utils";
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
  meta: {
    alignItems: "center",
    display: "flex",
    gap: space.md,
  },
  parts: {
    alignItems: "center",
    display: "flex",
    fontSize: fontSizes.xs,
    gap: space.xxs,
  },
  srOnly: {
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  },
});

interface PostListItem {
  date: string;
  lead: number | undefined;
  /** Set when the row is a series, which links to its own page. */
  parts?: number;
  slug: string;
  title: string;
}

interface DatedDocument {
  parts?: number;
  publishedAt: string;
  slug: string;
  title: string;
}

function year({ publishedAt }: DatedDocument) {
  return toUtcDate(publishedAt).getUTCFullYear();
}

function postListItems(documents: readonly DatedDocument[]): PostListItem[] {
  // Calendar-day strings sort chronologically as text.
  return documents
    .toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((document, i, sorted) => ({
      date: formatNumericDate(document.publishedAt),
      // Once per run, so a span of two years reads as two groups.
      lead:
        i === 0 || year(sorted[i - 1]) !== year(document)
          ? year(document)
          : undefined,
      parts: document.parts,
      slug: document.slug,
      title: document.title,
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
      {posts.map((post) => (
        <ListItemLink
          key={post.slug}
          params={{ slug: post.slug }}
          style={styles.row}
          to={post.parts === undefined ? to : "/series/$slug"}
        >
          <span {...stylex.props(styles.figure)}>{post.lead}</span>
          <ListItemTitle>{post.title}</ListItemTitle>
          <span {...stylex.props(styles.figure, styles.meta)}>
            {post.parts !== undefined && (
              <span {...stylex.props(styles.parts)}>
                <StackIcon aria-hidden="true" size="1em" />
                <span aria-hidden="true">{post.parts}</span>
                <span {...stylex.props(styles.srOnly)}>
                  {formatParts(post.parts)}
                </span>
              </span>
            )}
            <time>{post.date}</time>
          </span>
        </ListItemLink>
      ))}
    </List>
  );
}

export { PostList, type PostListItem, postListItems };
