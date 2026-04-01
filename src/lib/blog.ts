import type { Post } from "content-collections";
import { allPosts } from "content-collections";

const sortedPosts = allPosts.toSorted(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

export function getAllPosts(limit?: number): Post[] {
  return sortedPosts.slice(0, limit ?? sortedPosts.length);
}
