import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import { NotFound } from "@/components/not-found";
import { config } from "@/lib/config";
import { seo } from "@/lib/seo";

import appCss from "@/styles/app.css?url";

const HEAD = seo({
  description: config.description,
  extra: {
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "icon", href: "/favicon.ico" },
    ],
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "index, follow" },
      { property: "og:locale", content: "en_US" },
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
