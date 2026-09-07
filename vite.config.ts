import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { defineConfig } from "vite";

export default defineConfig({
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
    rsc(),
    viteReact(),
    cloudflare({
      viteEnvironment: {
        name: "ssr",
        childEnvironments: ["rsc"],
      },
    }),
  ],
  resolve: {
    alias: {
      // The package entry builds its `icons` and `iconsList` exports with
      // `import * as` over all 6093 icons, and a namespace import can't be
      // pruned. This deep entry is the same barrel without those two.
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
    },
    tsconfigPaths: true,
  },
  server: { port: 3000 },
});
