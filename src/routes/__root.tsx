import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import { NotFound } from "@/components/not-found";
import { config } from "@/lib/config";
import { seo } from "@/lib/seo";

import appCss from "@/styles/app.css?url";

const HEAD = seo({
  description: config.description,
  extra: {
    links: [
      { href: appCss, rel: "stylesheet" },
      {
        href: "/apple-touch-icon.png",
        rel: "apple-touch-icon",
        sizes: "180x180",
      },
      {
        href: "/favicon-32x32.png",
        rel: "icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        href: "/favicon-16x16.png",
        rel: "icon",
        sizes: "16x16",
        type: "image/png",
      },
      { href: "/favicon.ico", rel: "icon" },
    ],
    meta: [
      { charSet: "utf8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { content: "index, follow", name: "robots" },
      { content: "en_US", property: "og:locale" },
    ],
  },
  path: "/",
  title: config.name,
});

export const Route = createRootRoute({
  head: () => HEAD,
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
