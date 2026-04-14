import {
  createRootRoute,
  HeadContent,
  Link,
  Scripts,
} from "@tanstack/react-router";
import { LayoutProvider } from "@/components/layout-provider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { config } from "@/lib/config";
import { seo } from "@/lib/seo";
import appCss from "@/styles/app.css?url";

const HEAD = seo({
  title: config.name,
  description: config.description,
  path: "/",
  extra: {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "index, follow" },
      { property: "og:locale", content: "en_US" },
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
  },
});

export const Route = createRootRoute({
  head: () => HEAD,
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
        <h1 className="mb-3 font-medium text-3xl text-fg-1 capitalize">
          page not found
        </h1>
        <p className="my-0 text-base text-fg-2">
          This page doesn't exist or has been moved.
        </p>
        <Link
          className="mt-5 rounded-xl px-4 py-1 outline transition-colors duration-300 hover:text-fg-1"
          to="/"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
