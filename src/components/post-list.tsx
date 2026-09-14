import { List, ListItemLink, ListItemTitle } from "~/components/ui/list";
import { formatNumericDate, toUtcDate } from "~/lib/utils";

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
            className="gap-md grid grid-cols-[56px_minmax(0,1fr)_auto] items-center rounded-full"
            key={post.slug}
            params={{ slug: post.slug }}
            to={to}
          >
            <span className="text-fg-3 tabular-nums">
              {showYear ? post.year : ""}
            </span>
            <ListItemTitle className="flex-1">{post.title}</ListItemTitle>
            <time className="text-fg-3 tabular-nums">{post.date}</time>
          </ListItemLink>
        );
      })}
    </List>
  );
}

export { PostList, type PostListItem, postListItems };
