import { createFileRoute } from "@tanstack/react-router";
import { RightColumn } from "~/components/layout-provider";
import { Box } from "~/components/primitives/box";
import { Text } from "~/components/primitives/text";
import { getPostBySlug } from "~/components/rsc/posts";
import { TableOfContents } from "~/components/table-of-contents";
import { Sidebar } from "~/components/ui/sidebar";
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
    <Box as="section">
      <Box as="article">
        <Text as="h1" variant="heading">
          {post.title}
        </Text>
        <Text as="time">{formatDate(post.publishedAt)}</Text>

        {post.body}
      </Box>

      {post.headings.length > 0 && (
        <RightColumn>
          <Sidebar>
            <Box as="nav">
              <Text as="p" color="fg-2" marginBottom="sm" variant="heading">
                On this page
              </Text>

              <TableOfContents headings={post.headings} />
            </Box>
          </Sidebar>
        </RightColumn>
      )}
    </Box>
  );
}
