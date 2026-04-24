import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { LayoutProvider } from "~/components/layout-provider";
import { ProgressiveBlur } from "~/components/ui/progressive-blur";
import { config } from "~/lib/config";
import appCss from "~/styles/app.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#ffffff" },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: config.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: config.socials.twitter },
      { name: "twitter:creator", content: config.socials.twitter },
    ],
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
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pageUrl = `${config.siteUrl}${pathname}`;

  return (
    <html lang="en">
      <head>
        <link href={pageUrl} rel="canonical" />
        <meta content={pageUrl} property="og:url" />
        <HeadContent />
      </head>
      <body className="min-h-screen">
        <LayoutProvider>
          <ProgressiveBlur className="fixed z-30" position="top" />
          {children}
          <ProgressiveBlur className="fixed z-30" position="bottom" />
        </LayoutProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="mx-auto px-6 py-12 sm:py-20">
      <div className="flex h-[calc(100vh-12rem)] w-full flex-col items-center justify-center">
        <h1 className="mb-3 text-balance font-medium text-3xl text-fg-1 capitalize">
          page not found
        </h1>
        <p className="my-0 text-base text-fg-2">
          This page doesn't exist or has been moved.
        </p>
        <Link
          className="mt-5 inline-flex min-h-10 items-center rounded-xl px-4 py-2 outline transition-[color,scale] duration-300 hover:text-fg-1 active:scale-[0.96]"
          to="/"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
