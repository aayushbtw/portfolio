import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defaultMetadata, name } from "@/app/_default-metadata";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    ...defaultMetadata,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      type: "article",
      siteName: name,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      locale: "en_US",
      url: `/writings/${slug}`,
      authors: name,
      publishedTime: post.frontmatter.publishedAt,
    },
    alternates: { canonical: `/writings/${slug}` },
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
