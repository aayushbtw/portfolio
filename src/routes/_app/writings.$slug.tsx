import { createFileRoute } from "@tanstack/react-router";

import { RightColumn } from "~/components/layout-provider";
import { TableOfContents } from "~/components/table-of-contents";
import { Page, PageHeader } from "~/components/ui/page";
import { config } from "~/lib/config";
import { seo } from "~/lib/seo";
import { formatDate } from "~/lib/utils";
import { getWriting } from "~/server/writings";

export const Route = createFileRoute("/_app/writings/$slug")({
  loader: ({ params: { slug } }) => getWriting({ data: slug }),
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
    <Page variant="compact">
      <PageHeader
        meta={
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        }
        title={post.title}
      />

      {post.body}

      {post.headings.length > 0 && (
        <RightColumn>
          <aside>
            <nav aria-label="On this page">
              <TableOfContents headings={post.headings} />
            </nav>
          </aside>
        </RightColumn>
      )}
    </Page>
  );
}
