// src/routes/robots[.]txt.ts

import { createFileRoute } from "@tanstack/react-router";
import { config } from "@/lib/config";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const robots = `User-agent: *
Allow: /

Sitemap: ${config.domain}/sitemap.xml`;

        return new Response(robots, {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      },
    },
  },
});
