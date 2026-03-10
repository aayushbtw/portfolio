import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { config } from "@/lib/config";
import { generateMetadata as buildMetadata, formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    ...buildMetadata({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: `/writings/${slug}`,
    }),
    openGraph: {
      type: "article",
      siteName: config.name,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      locale: "en_US",
      url: `/writings/${slug}`,
      authors: config.name,
      publishedTime: post.frontmatter.publishedAt,
    },
  };
}

export default async function WritingPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { default: Content, frontmatter } = post;

  return (
    <div>
      <h1>{frontmatter.title}</h1>
      <time className="text-fg-3 text-sm">
        {formatDate(frontmatter.publishedAt)}
      </time>

      <article>
        <Content />
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((w) => ({ slug: w.slug }));
}
