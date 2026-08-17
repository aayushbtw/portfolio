import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import stylex from "@stylexjs/unplugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { defineConfig } from "vite";

/**
 * Two problems with letting `@stylexjs/unplugin` manage the CSS asset here, and
 * one fix for both.
 *
 * Its `generateBundle` appends the collected rules by emitting a *new* hashed
 * asset, deleting the old one and rewriting references to it. That rewrite only
 * reaches the bundle it was handed, so:
 *
 *   - In the rsc environment it trips `@vitejs/plugin-rsc`, which later walks
 *     the rsc bundle looking up each chunk's `importedCss` by name and asserts
 *     the asset is still there.
 *   - In the client environment it renames the asset after TanStack's manifest
 *     has already recorded the old name, so the prerendered HTML keeps linking
 *     the pre-append file and ships without any StyleX at all. Nothing catches
 *     that: the markup is identical either way, only the stylesheet is wrong.
 *
 * So `generateBundle` is suppressed everywhere and `writeBundle` is allowed in
 * the client only. That path appends to the existing file on disk under its
 * existing name, which keeps every recorded reference valid.
 *
 * The trade-off is that the content hash is computed before the append, so a
 * change confined to StyleX output produces the same filename with different
 * content. `assertStyleXIsServed` in `scripts/` guards the failure this was;
 * cache-busting is handled by the deploy, which uploads fresh assets per build.
 */
function stylexAppendInPlace(options?: Parameters<typeof stylex.vite>[0]) {
  const plugin = stylex.vite(options);

  plugin.generateBundle = undefined;

  const write = plugin.writeBundle;
  if (typeof write === "function") {
    plugin.writeBundle = function stylexWriteBundle(
      this: { environment: { name: string } },
      ...args: unknown[]
    ) {
      return this.environment.name === "client"
        ? write.apply(this, args)
        : undefined;
    };
  }

  return plugin;
}

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
  plugins: [
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
    stylexAppendInPlace({
      // StyleX's layers are declared after the site's, so a component that says
      // `color="fg-2"` beats the prose default in `components` by layer order.
      // Naming them here rather than relying on `@stylex;` sitting last in
      // app.css: with layers off StyleX pads every selector with six
      // `:not(#\#)` to fake the same precedence, which is most of the CSS.
      useCSSLayers: { before: ["base", "components"] },
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
