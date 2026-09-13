import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { tomekit } from "tomekit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tomekit(),
    tailwindcss(),
    tanstackStart({
      pages: [
        { path: "/", prerender: { enabled: false } },
        { path: "/music", prerender: { enabled: false } },
      ],
      prerender: {
        crawlLinks: true,
        enabled: true,
      },
      rsc: { enabled: true },
      sitemap: {
        enabled: true,
        host: "https://aayush.cv",
      },
    }),
    rsc(),
    viteReact(),
    cloudflare({
      viteEnvironment: {
        childEnvironments: ["rsc"],
        name: "ssr",
      },
    }),
  ],
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
});
