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

const postsDir = path.join(process.cwd(), "posts");

function getSlugs() {
  return fs
    .readdirSync(postsDir)
    .filter((file) => path.extname(file) === ".mdx")
    .map((file) => path.basename(file, ".mdx"));
}

export async function getPosts(limit?: number): Promise<Post[]> {
  const slugs = getSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = (await import(`@/posts/${slug}.mdx`)) as {
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
