import fs from "node:fs";
import path from "node:path";

export type Frontmatter = {
  title: string;
  publishedAt: string;
  description: string;
  image?: string;
};

export type Post = {
  slug: string;
  metadata: Frontmatter;
};

const postsDirectory = path.join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => path.extname(file) === ".mdx")
    .map((file) => path.basename(file, ".mdx"));
}

export async function getPostBySlug(slug: string) {
  try {
    return (await import(`@/_posts/${slug}.mdx`)) as {
      default: React.ComponentType;
      metadata: Frontmatter;
    };
  } catch {
    return null;
  }
}

export async function getAllPosts(limit?: number): Promise<Post[]> {
  const slugs = getPostSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = (await import(`@/_posts/${slug}.mdx`)) as {
        metadata: Frontmatter;
      };

      return { slug, metadata };
    })
  );

  return posts
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
    )
    .slice(0, limit ?? posts.length);
}
