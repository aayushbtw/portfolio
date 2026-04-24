import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { allPosts } from "content-collections";
import {
  Showcase,
  ShowcaseCaption,
  ShowcaseImage,
} from "~/components/ui/showcase";

const mdxComponents = { Showcase, ShowcaseImage, ShowcaseCaption };

const getPostBySlugServerFn = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const post = allPosts.find((p) => p.slug === slug);
    if (!post) {
      throw notFound();
    }
    const MDXContent = post.mdx;
    return {
      ...post,
      mdx: await renderServerComponent(
        <MDXContent components={mdxComponents} />
      ),
    };
  });

export const getPostBySlug = (slug: string) =>
  getPostBySlugServerFn({ data: slug });

export const getAllPosts = createServerFn({ method: "GET" }).handler(() => {
  const sorted = allPosts.toSorted(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return sorted.map(({ mdx, ...post }) => post);
});
