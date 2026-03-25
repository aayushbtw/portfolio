import { Link } from "@tanstack/react-router";
import type { Post } from "content-collections";

function ListPosts({ posts }: { posts: Post[] }) {
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
    <ul className="group">
      {grouped.map((post, i) => {
        const showYear = i === 0 || grouped[i - 1].year !== post.year;
        return (
          <li
            className="border-border border-t first:border-t-0"
            key={post.slug}
          >
            <Link
              className="flex items-center gap-4 py-[0.5em] text-fg-3 text-sm transition-opacity hover:opacity-100! group-hover:opacity-40"
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
