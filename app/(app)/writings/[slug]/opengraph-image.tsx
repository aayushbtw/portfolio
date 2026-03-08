import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE, OGImage } from "@/components/og-image";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export const alt = "Writing";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { title, description } = post.frontmatter;

  return OGImage({ title, description });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
