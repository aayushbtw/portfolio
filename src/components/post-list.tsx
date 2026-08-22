import { Link } from "@tanstack/react-router";
import { List, ListItem, ListItemTitle } from "~/components/ui/list";

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
        // The year prints once per run, so a list spanning two years reads as
        // two groups without a heading between them.
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

export { PostList, type PostListItem };
