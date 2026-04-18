/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: required for markdown */
import { createFileRoute, notFound } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { RightColumn } from "@/components/layout-provider";
import { TableOfContents } from "@/components/table-of-contents";
import { config } from "@/lib/config";
import { seo } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/_app/writings/$slug")({
  loader: ({ params }) => {
    const post = allPosts.find((p) => p.slug === params.slug);
    if (!post) {
      throw notFound();
    }
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    const { post } = loaderData;
    return {
      ...seo({
        title: post.title,
        description: post.description,
        meta: [
          { property: "og:type", content: "article" },
          { property: "article:author", content: config.name },
          { property: "article:published_time", content: post.publishedAt },
          {
            property: "article:modified_time",
            content: post.modifiedAt ?? post.publishedAt,
          },
        ],
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            image: `${config.siteUrl}/api/og?title=${encodeURIComponent(post.title)}`,
            author: { "@type": "Person", name: config.name },
            datePublished: post.publishedAt,
            dateModified: post.modifiedAt ?? post.publishedAt,
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
