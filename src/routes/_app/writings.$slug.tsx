import { createFileRoute } from "@tanstack/react-router";
import { RightColumn } from "~/components/layout-provider";
import { getPostBySlug } from "~/components/rsc/posts";
import { TableOfContents } from "~/components/table-of-contents";
import { config } from "~/lib/config";
import { seo } from "~/lib/seo";
import { formatDate } from "~/lib/utils";

export const Route = createFileRoute("/_app/writings/$slug")({
  loader: ({ params: { slug } }) => getPostBySlug(slug),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    const post = loaderData;
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
  const post = Route.useLoaderData();

  return (
    <section>
      <article>
        <h1 className="text-balance">{post.title}</h1>
        <time className="text-fg-3">{formatDate(post.publishedAt)}</time>

        {post.mdx}
      </article>

      {post.headings.length > 0 && (
        <RightColumn>
          <aside className="sticky top-2xl hidden lg:block">
            <nav>
              <p className="mb-sm font-medium text-fg-2">On this page</p>

              <TableOfContents headings={post.headings} />
            </nav>
          </aside>
        </RightColumn>
      )}
    </section>
  );
}
