import fs from "node:fs";
import path from "node:path";

export interface Frontmatter {
  description: string;
  image?: string;
  publishedAt: string;
  title: string;
}

export interface Post {
  frontmatter: Frontmatter;
  slug: string;
}

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
      frontmatter: Frontmatter;
    };
  } catch {
    return null;
  }
}

export async function getAllPosts(limit?: number): Promise<Post[]> {
  const slugs = getPostSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = (await import(`@/_posts/${slug}.mdx`)) as {
        frontmatter: Frontmatter;
      };

      return { slug, frontmatter };
    })
  );

  return posts
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime()
    )
    .slice(0, limit ?? posts.length);
}
