import type { Post } from "content-collections";
import { allPosts } from "content-collections";

const sortedPosts = allPosts.toSorted(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

export const getAllPosts = (limit?: number): Post[] =>
  sortedPosts.slice(0, limit ?? sortedPosts.length);
