import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import stylex from "@stylexjs/unplugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { defineConfig } from "vite";

/**
 * StyleX's `generateBundle` swaps the bundle's CSS asset for a hashed copy that
 * carries the collected rules, and it does this in every environment. In the
 * rsc environment that breaks `@vitejs/plugin-rsc`, which later walks the rsc
 * bundle looking up each chunk's `importedCss` by name and asserts it is still
 * there. Styles are collected in a store shared across environments and client
 * builds last, so emitting once from the client loses nothing.
 */
function stylexClientOnly(options?: Parameters<typeof stylex.vite>[0]) {
  const plugin = stylex.vite(options);
  const isClient = (env: { name: string }) => env.name === "client";

  for (const hook of ["generateBundle", "writeBundle"] as const) {
    const original = plugin[hook];
    if (typeof original !== "function") {
      continue;
    }
    plugin[hook] = function stylexBundleHook(
      this: { environment: { name: string } },
      ...args: unknown[]
    ) {
      return isClient(this.environment)
        ? original.apply(this, args)
        : undefined;
    };
  }

  return plugin;
}

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
  plugins: [
    tailwindcss(),
    tanstackStart({
      rsc: { enabled: true },
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
      sitemap: {
        enabled: true,
        host: "https://aayush.cv",
      },
      pages: [
        { path: "/", prerender: { enabled: false } },
        { path: "/music", prerender: { enabled: false } },
      ],
    }),
    stylexClientOnly({
      // Layers off, not on: while Tailwind is still here, StyleX has to win the
      // cascade against the utilities it is replacing. Flip to `true` once the
      // last Tailwind class is gone.
      useCSSLayers: false,
      // StyleX resolves token imports itself, in Babel, and knows nothing about
      // Vite's resolver. Without this it cannot follow `~/` to a `.stylex.ts`.
      aliases: { "~/*": [path.join(import.meta.dirname, "src", "*")] },
      unstable_moduleResolution: {
        type: "commonJS",
        rootDir: import.meta.dirname,
      },
    }),
    rsc(),
    viteReact(),
    cloudflare({
      viteEnvironment: {
        name: "ssr",
        childEnvironments: ["rsc"],
      },
    }),
  ],
});
