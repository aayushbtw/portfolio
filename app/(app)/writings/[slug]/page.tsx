import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type Frontmatter, getPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((w) => ({ slug: w.slug }));
}

export const dynamicParams = false;

async function importPost(slug: string) {
  try {
    return (await import(`@/posts/${slug}.mdx`)) as {
      default: React.ComponentType;
      metadata: Frontmatter;
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mod = await importPost(slug);
  if (!mod) {
    return {};
  }
  return {
    title: mod.metadata.title,
    description: mod.metadata.description,
  };
}

export default async function WritingPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const mod = await importPost(slug);

  if (!mod) {
    notFound();
  }

  const { default: Content, metadata } = mod;

  return (
    <div>
      <h1>{metadata.title}</h1>
      <time className="text-fg-3 text-sm">
        {formatDate(metadata.publishedAt)}
      </time>

      <article>
        <Content />
      </article>
    </div>
  );
}
