import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createRouter({
    context: { queryClient },
    defaultPreload: "intent",
    defaultPreloadStaleTime: Number.POSITIVE_INFINITY,
    defaultStaleTime: Number.POSITIVE_INFINITY,
    notFoundMode: "root",
    routeTree,
    scrollRestoration: true,
    trailingSlash: "preserve",
  });

  setupRouterSsrQueryIntegration({ queryClient, router });

  return router;
}

declare module "@tanstack/react-start" {
  interface Register {
    router: Awaited<ReturnType<typeof getRouter>>;
    ssr: true;
  }
}
