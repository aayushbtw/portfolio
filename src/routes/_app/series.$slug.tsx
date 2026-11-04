import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSeries } from "~/server/writings";

// Series pages moved to /writings/$slug; this keeps old links working.
export const Route = createFileRoute("/_app/series/$slug")({
  loader: async ({ params: { slug } }) => {
    await getSeries({ data: slug });

    throw redirect({
      params: { slug },
      statusCode: 301,
      to: "/writings/$slug",
    });
  },
});
