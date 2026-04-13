import { IconArrowBackUp } from "@tabler/icons-react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { Sidebar } from "@/components/sidebar";
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
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    return {
      ...seo({
        title: loaderData.title,
        description: loaderData.description,
        path: `/writings/${loaderData.slug}`,
        type: "article",
        article: {
          author: config.name,
          publishedAt: loaderData.publishedAt,
          modifiedAt: loaderData.modifiedAt ?? loaderData.publishedAt,
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
      <h1 className="mb-px">{post.title}</h1>
      <time className="text-fg-3">{formatDate(post.publishedAt)}</time>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: trusted mdx output */}
      <article dangerouslySetInnerHTML={{ __html: post.html }} />

      {post.headings.length > 0 && (
        <Sidebar>
          <nav>
            <Link
              className="text-fg-3/80 transition-colors duration-200 hover:text-fg-2"
              to="/writings"
            >
              <IconArrowBackUp className="size-4" />
            </Link>

            <p className="mb-2 font-medium text-fg-2">On this page</p>

            <TableOfContents headings={post.headings} />
          </nav>
        </Sidebar>
      )}
    </section>
  );
}
