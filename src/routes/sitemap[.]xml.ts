// src/routes/sitemap[.]xml.ts

import { createFileRoute } from "@tanstack/react-router";
import { allPosts, allSkills } from "content-collections";
import { config } from "~/lib/config";

interface Entry {
  lastmod?: string;
  path: string;
}

// Only pages worth landing on. `/writings` and `/skills` list their children,
// so the children are here too; `api/og` and `robots.txt` are not pages.
function entries(): Entry[] {
  const staticPaths: Entry[] = [
    { path: "/" },
    { path: "/projects" },
    { path: "/writings" },
    { path: "/skills" },
    { path: "/music" },
    { path: "/usage" },
  ];

  const posts: Entry[] = allPosts.map((post) => ({
    lastmod: (post.modifiedAt ?? post.publishedAt).split("T")[0],
    path: `/writings/${post.slug}`,
  }));

  const skills: Entry[] = allSkills.map((skill) => ({
    path: `/skills/${skill.slug}`,
  }));

  return [...staticPaths, ...posts, ...skills];
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
