import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageTitle } from "~/components/page-header";
import { PostList } from "~/components/post-list";
import { Page } from "~/components/ui/page";
import { seo } from "~/lib/seo";
import { getPostList } from "~/server/posts";

const title = "Writings";
const description = "Thoughts on software, design and building for the web.";

export const Route = createFileRoute("/_app/writings/")({
  loader: () => getPostList(),
  head: () => seo({ title, description }),
  component: WritingsPage,
});

function WritingsPage() {
  const posts = Route.useLoaderData();

  return (
    <Page>
      <section>
        <PageHeader>
          <PageTitle>{title}</PageTitle>
        </PageHeader>
        <PostList posts={posts} />
      </section>
    </Page>
  );
}
