import interLatin from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { LayoutProvider } from "~/components/layout-provider";
import { Text } from "~/components/primitives/text";
import { ProgressiveBlur } from "~/components/ui/progressive-blur";
import {
  FallbackShell,
  HomeLink,
  RootBody,
  SkipLink,
} from "~/components/ui/shell";
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
      // In build, the StyleX plugin appends its rules onto appCss. In dev it
      // serves them from a virtual endpoint instead, so nothing links them.
      ...(import.meta.env.DEV
        ? [{ rel: "stylesheet", href: "/virtual:stylex.css" }]
        : []),
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
      <RootBody>
        <SkipLink />
        <LayoutProvider>
          <ProgressiveBlur position="top" />
          {children}
          <ProgressiveBlur position="bottom" />
        </LayoutProvider>
        <Scripts />
      </RootBody>
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
    <FallbackShell>
      <Text as="h1" marginBottom="sm" variant="display">
        {title}
      </Text>
      <Text variant="lead">{children}</Text>
      <HomeLink />
    </FallbackShell>
  );
}
