import { List, ListItemLink, ListItemTitle } from "~/components/ui/list";

interface PostListItem {
  date: string;
  slug: string;
  title: string;
  year: number;
}

function PostList({ posts }: { posts: PostListItem[] }) {
  return (
    <List>
      {posts.map((post, i) => {
        // Once per run, so a span of two years reads as two groups.
        const showYear = i === 0 || posts[i - 1].year !== post.year;
        return (
          <ListItemLink
            className="gap-md grid grid-cols-[56px_minmax(0,1fr)_auto] items-center"
            key={post.slug}
            params={{ slug: post.slug }}
            to="/writings/$slug"
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

export { PostList, type PostListItem };
