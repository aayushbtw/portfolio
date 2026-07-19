import { Link } from "@tanstack/react-router";
import { List } from "./ui/list";

interface PostSummary {
  publishedAt: string;
  slug: string;
  title: string;
}

function ListPosts({
  posts,
  className,
}: {
  posts: PostSummary[];
  className?: string;
}) {
  const grouped = posts.map((post) => {
    const d = new Date(`${post.publishedAt.split("T")[0]}T00:00:00`);
    return {
      year: d.getFullYear(),
      slug: post.slug,
      title: post.title,
      date: `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`,
    };
  });

  return (
    <List className={className}>
      {grouped.map((post, i) => {
        const showYear = i === 0 || grouped[i - 1].year !== post.year;
        return (
          <li
            className="border-border border-t py-sm transition-[opacity,scale] duration-150 first:border-t-0 hover:opacity-100 active:scale-[0.99] group-hover/ul:opacity-40"
            key={post.slug}
          >
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
          </li>
        );
      })}
    </List>
  );
}

export { ListPosts };
