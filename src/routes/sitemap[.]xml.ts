import { createFileRoute } from "@tanstack/react-router";
import { collections } from "tomekit/content";
import type { DocumentOf } from "tomekit/content";

import { config } from "~/lib/config";

interface Entry {
  lastmod?: string;
  path: string;
}

// Only pages worth landing on, children of a list page included.
function entries(): Entry[] {
  const staticPaths: Entry[] = [
    { path: "/" },
    { path: "/writings" },
    { path: "/skills" },
    { path: "/explorations" },
    { path: "/music" },
    { path: "/usage" },
  ];

  const documents: Entry[] = collections
    .names()
    .flatMap((name) => collections.get(name).documents())
    .map((document) => ({
      lastmod: lastModified(document)?.split("T")[0],
      path: document.metadata.url,
    }));

  return [...staticPaths, ...documents];
}

function lastModified({ metadata }: DocumentOf) {
  if ("modifiedAt" in metadata && metadata.modifiedAt !== undefined) {
    return metadata.modifiedAt;
  }

  if ("publishedAt" in metadata) {
    return metadata.publishedAt;
  }
}

function toXml(list: Entry[]) {
  const urls = list
    .map(({ path, lastmod }) => {
      const loc = `<loc>${config.siteUrl}${path}</loc>`;
      const mod = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";

      return `<url>${loc}${mod}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(toXml(entries()), {
          headers: {
            "Cache-Control": "public, max-age=3600",
            "Content-Type": "application/xml",
          },
        }),
    },
  },
});
