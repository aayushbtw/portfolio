/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: required for markdown */
import { createFileRoute, notFound } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { RightColumn } from "@/components/layout-provider";
import { TableOfContents } from "@/components/table-of-contents";
import { config } from "@/lib/config";
import { seo } from "@/lib/seo";
import { getEnv } from "@/lib/server-fns";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/_app/writings/$slug")({
  loader: async ({ params }) => {
    const post = allPosts.find((p) => p.slug === params.slug);
    if (!post) {
      throw notFound();
    }
    const env = await getEnv();
    return { post, env };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    return {
      ...seo({
        title: loaderData.post.title,
        description: loaderData.post.description,
        domain: loaderData.env.domain,
        meta: [
          { property: "og:type", content: "article" },
          { property: "article:author", content: config.name },
          {
            property: "article:published_time",
            content: loaderData.post.publishedAt,
          },
          {
            property: "article:modified_time",
            content: loaderData.post.modifiedAt ?? loaderData.post.publishedAt,
          },
        ],
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: loaderData.post.title,
            description: loaderData.post.description,
            image: `${loaderData.env.domain}/api/og?title=${encodeURIComponent(loaderData.post.title)}`,
            author: { "@type": "Person", name: config.name },
            datePublished: loaderData.post.publishedAt,
            dateModified:
              loaderData.post.modifiedAt ?? loaderData.post.publishedAt,
          }),
        },
      ],
    };
  },

  component: WritingPage,
});

function WritingPage() {
  const { post } = Route.useLoaderData();

  return (
    <section>
      <h1>{post.title}</h1>
      <time className="text-fg-3">{formatDate(post.publishedAt)}</time>

      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {post.headings.length > 0 && (
        <RightColumn>
          <aside className="sticky top-page-t hidden lg:block">
            <nav>
              <p className="mt-1.5 mb-2 font-medium text-fg-2">On this page</p>

              <TableOfContents headings={post.headings} />
            </nav>
          </aside>
        </RightColumn>
      )}
    </section>
  );
}
