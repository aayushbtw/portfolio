import { createFileRoute } from "@tanstack/react-router";

import { config } from "~/lib/config";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const robots = [
          "User-agent: *",
          "Allow: /",
          "",
          `Sitemap: ${config.siteUrl}/sitemap.xml`,
        ].join("\n");

        return new Response(robots, {
          headers: {
            "Cache-Control": "public, max-age=3600",
            "Content-Type": "text/plain",
          },
        });
      },
    },
  },
});
