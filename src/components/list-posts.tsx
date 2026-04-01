import { Link } from "@tanstack/react-router";
import type { Post } from "content-collections";

function ListPosts({ posts }: { posts: Post[] }) {
  const grouped = posts.map((post) => {
    const d = new Date(`${post.publishedAt.split("T")[0]}T00:00:00`);
    return {
      date: `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`,
      slug: post.slug,
      title: post.title,
      year: d.getFullYear(),
    };
  });

  return (
    <ul className="group">
      {grouped.map((post, i) => {
        const showYear = i === 0 || grouped[i - 1].year !== post.year;
        return (
          <li
            className="border-border border-t first:border-t-0"
            key={post.slug}
          >
            <Link
              className="flex items-center gap-4 py-2.5 text-fg-3 text-sm transition-opacity hover:opacity-100! group-hover:opacity-40"
              data-unstyled
              params={{ slug: post.slug }}
              to="/writings/$slug"
            >
              <span className="w-12 tabular-nums">
                {showYear ? post.year : ""}
              </span>
              <span className="flex-1 text-fg-1">{post.title}</span>
              <time className="tabular-nums">{post.date}</time>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export { ListPosts };
