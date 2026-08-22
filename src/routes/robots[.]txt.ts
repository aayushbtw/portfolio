import { createFileRoute } from "@tanstack/react-router";
import { config } from "~/lib/config";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        // `api/og` renders images for crawlers to fetch by URL, never a page to
        // index. Everything else is fair game.
        const robots = [
          "User-agent: *",
          "Allow: /",
          "Disallow: /api/",
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
