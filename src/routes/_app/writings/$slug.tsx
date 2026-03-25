import { createFileRoute, notFound } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { config } from "@/lib/config";
import { pageMeta } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/_app/writings/$slug")({
  loader: ({ params }) => {
    const post = allPosts.find((p) => p.slug === params.slug);
    if (!post) {
      throw notFound();
    }
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    return {
      ...pageMeta({
        title: loaderData.title,
        description: loaderData.description,
        path: `/writings/${loaderData.slug}`,
        type: "article",
        article: {
          author: config.name,
          publishedAt: loaderData.publishedAt,
        },
      }),
    };
  },

  component: WritingPage,
});

function WritingPage() {
  const post = Route.useLoaderData();

  return (
    <section>
      <h1 className="mb-[0.1em]">{post.title}</h1>
      <time className="text-fg-3 text-sm">{formatDate(post.publishedAt)}</time>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: trusted markdown output */}
      <article dangerouslySetInnerHTML={{ __html: post.html }} />
    </section>
  );
}
