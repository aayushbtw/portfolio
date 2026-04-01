import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    defaultStaleTime: Number.POSITIVE_INFINITY,
    notFoundMode: "root",
    routeTree,
    scrollRestoration: true,
    trailingSlash: "preserve",
  });
  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
