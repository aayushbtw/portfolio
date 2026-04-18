import { cloudflare } from "@cloudflare/vite-plugin";
import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { config } from "./src/lib/config"; // Absolute PATH on purpose

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
  plugins: [
    tailwindcss(),
    cloudflare({
      viteEnvironment: { name: "ssr" },
    }),
    contentCollections(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true, // Discovers all linkable pages
      },
      sitemap: {
        enabled: true,
        host: config.siteUrl,
      },
    }),
    viteReact(),
  ],
});
