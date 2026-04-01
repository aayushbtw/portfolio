import { IconArrowBackUp } from "@tabler/icons-react";
import {
  createFileRoute,
  getRouteApi,
  Link,
  notFound,
} from "@tanstack/react-router";
import { allPosts } from "content-collections";

import { Sidebar } from "@/components/sidebar";
import { TableOfContents } from "@/components/table-of-contents";
import { config } from "@/lib/config";
import { seo } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

const routeApi = getRouteApi("/_app/writings/$slug");

function WritingPage() {
  const post = routeApi.useLoaderData();

  return (
    <section>
      <h1 className="mb-px">{post.title}</h1>
      <time className="text-fg-3 text-sm">{formatDate(post.publishedAt)}</time>
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

            <p className="mb-2 font-medium text-fg-2 text-sm">On this page</p>

            <TableOfContents headings={post.headings} />
          </nav>
        </Sidebar>
      )}
    </section>
  );
}

export const Route = createFileRoute("/_app/writings/$slug")({
  component: WritingPage,
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    return {
      ...seo({
        article: {
          author: config.name,
          modifiedAt: loaderData.modifiedAt ?? loaderData.publishedAt,
          publishedAt: loaderData.publishedAt,
        },
        description: loaderData.description,
        path: `/writings/${loaderData.slug}`,
        title: loaderData.title,
        type: "article",
      }),
    };
  },

  loader: ({ params }) => {
    const post = allPosts.find((p) => p.slug === params.slug);
    if (!post) {
      throw notFound();
    }
    return post;
  },
});
