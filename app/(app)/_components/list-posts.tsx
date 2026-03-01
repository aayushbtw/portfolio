import Link from "next/link";
import { getPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

async function ListPosts({ limit }: { limit?: number }) {
  const posts = await getPosts(limit);
return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            className="flex items-center gap-2"
            href={`/writings/${post.slug}`}
          >
            <h6>{post.metadata.title}</h6>
            <div className="flex grow border-b border-dashed" />
            <time>{formatDate(post.metadata.publishedAt)}</time>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export { ListPosts };
