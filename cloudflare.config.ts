import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    compatibilityDate: "2026-09-16",
    compatibilityFlags: ["nodejs_compat"],
    domains: ["aayush.cv"],
    entrypoint: "@tanstack/react-start/server-entry",
    env: {
      SPOTIFY_CLIENT_ID: bindings.secret(),
      SPOTIFY_CLIENT_SECRET: bindings.secret(),
      SPOTIFY_REFRESH_TOKEN: bindings.secret(),
    },
    name: "portfolio",
    observability: {
      logs: { enabled: true, headSamplingRate: 0.05, invocationLogs: true },
      traces: { enabled: false },
    },
    previewUrls: false,
    workersDev: false,
  },
});
