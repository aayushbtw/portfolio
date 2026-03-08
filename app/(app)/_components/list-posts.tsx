import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

async function ListPosts({ limit }: { limit?: number }) {
  const posts = await getAllPosts(limit);

  const grouped = posts.map((post) => {
    const d = new Date(`${post.metadata.publishedAt.split("T")[0]}T00:00:00`);
    return {
      year: d.getFullYear(),
      slug: post.slug,
      title: post.metadata.title,
      date: `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`,
    };
  });

  return (
    <ul className="group">
      {grouped.map((post, i) => {
        const showYear = i === 0 || grouped[i - 1].year !== post.year;
        return (
          <li
            className="m-0! border-border border-t first:border-t-0"
            key={post.slug}
          >
            <Link
              className="flex items-center gap-4 py-2.5 text-sm transition-opacity hover:opacity-100! group-hover:opacity-40"
              href={`/writings/${post.slug}`}
            >
              <span className="w-12 text-fg-3 tabular-nums">
                {showYear ? post.year : ""}
              </span>
              <span className="flex-1">{post.title}</span>
              <time className="text-fg-3 tabular-nums">{post.date}</time>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export { ListPosts };
