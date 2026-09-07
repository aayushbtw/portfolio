import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
  // The client scanner finds this one; the server scanners don't, and the
  // Worker environments can't externalise it, so each cold start crawls all
  // 6093 icon modules behind the barrel. Every other runtime dep prebundles
  // on its own.
  environments: {
    ssr: { optimizeDeps: { include: ["@tabler/icons-react"] } },
    rsc: { optimizeDeps: { include: ["@tabler/icons-react"] } },
  },
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
});
