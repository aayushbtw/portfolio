import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { config } from "@/lib/config";
import appCss from "../global.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: config.name },
      { name: "description", content: config.description },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: config.name },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
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
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg-1 font-normal font-sans text-base text-fg-3 antialiased selection:bg-brand/20">
        <Outlet />
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center pb-10">
      <h1 className="font-medium text-3xl text-fg-1 capitalize">
        page not found
      </h1>
      <p className="mt-3 text-fg-2">
        This page doesn't exist or has been moved.
      </p>
      <Link
        className="mt-5 rounded-xl px-4 py-1 outline transition-all duration-300 hover:text-fg-1"
        to="/"
      >
        Go Home
      </Link>
    </div>
  );
}
