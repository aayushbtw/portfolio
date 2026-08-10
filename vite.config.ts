import { cloudflare } from "@cloudflare/vite-plugin";
import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
  plugins: [
    tailwindcss(),
    contentCollections({ environment: "ssr" }),
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
});
