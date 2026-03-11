import { ListPosts } from "@/components/list-posts";
import { generateMetadata } from "@/lib/utils";
import { content } from "./_content";

export const metadata = generateMetadata({
  title: content.title,
  description: content.description,
  url: content.url,
});

export default function WritingsPage() {
  return (
    <>
      <h1 data-title>Writings</h1>
      <ListPosts />
    </>
  );
}
