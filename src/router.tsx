import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultStaleTime: Number.POSITIVE_INFINITY,
    defaultPreload: "intent",
    defaultPreloadStaleTime: Number.POSITIVE_INFINITY,
    trailingSlash: "preserve",
    notFoundMode: "root",
    scrollRestoration: true,
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
}

declare module "@tanstack/react-start" {
  interface Register {
    router: Awaited<ReturnType<typeof getRouter>>;
    ssr: true;
  }
}
