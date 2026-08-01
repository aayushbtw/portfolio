import interLatin from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
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
      // The stylesheet @imports the font, so the browser can't discover the
      // woff2 until the CSS has parsed. Preloading the latin subset overlaps
      // those two round trips instead of running them back to back.
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: interLatin,
        crossOrigin: "anonymous",
      },
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
  errorComponent: ErrorPage,
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
        <a className="skip-link" href="#main">
          Skip to content
        </a>
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
    <Fallback title="Page not found">
      This page doesn’t exist or has been moved.
    </Fallback>
  );
}

function ErrorPage() {
  return (
    <Fallback title="Something went wrong">
      This page failed to load. Try again in a moment.
    </Fallback>
  );
}

function Fallback({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="typeset mx-auto px-lg py-xl sm:py-2xl">
      <div className="flex h-[calc(100vh-12rem)] w-full flex-col items-center justify-center">
        <h1 className="mb-sm text-balance text-xl">{title}</h1>
        <p className="my-0 text-md">{children}</p>
        <Link
          className="mt-lg inline-flex min-h-9 items-center rounded-md px-md no-underline outline transition-[color,scale] duration-300 hover:text-fg-1 active:scale-[0.96]"
          to="/"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
