import { createFileRoute } from "@tanstack/react-router";

import { config } from "~/lib/config";
import { allPosts, showcasedSkills } from "~/server/content";

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
    { path: "/music" },
    { path: "/usage" },
  ];

  const posts: Entry[] = allPosts.map((post) => ({
    lastmod: (post.modifiedAt ?? post.publishedAt).split("T")[0],
    path: `/writings/${post.slug}`,
  }));

  const skills: Entry[] = showcasedSkills.map((skill) => ({
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
