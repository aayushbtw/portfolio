import { createFileRoute } from "@tanstack/react-router";

import { seo } from "~/lib/seo";
import { formatDate } from "~/lib/utils";
import { getExploration } from "~/server/explorations";

export const Route = createFileRoute("/_app/explorations/$slug")({
  loader: ({ params: { slug } }) => getExploration({ data: slug }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }

    return seo({
      title: loaderData.title,
      description: loaderData.description,
    });
  },
  component: ExplorationPage,
});

function ExplorationPage() {
  const exploration = Route.useLoaderData();

  return (
    <section>
      <article>
        <h1 className="mb-sm text-balance">{exploration.title}</h1>
        <time className="text-fg-3 text-sm tracking-tight">
          {formatDate(exploration.publishedAt)}
        </time>

        {exploration.body}
      </article>
    </section>
  );
}
