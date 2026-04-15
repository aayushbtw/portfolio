import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";

export const getEnv = createServerFn().handler(() => {
  return {
    domain: env.SITE_URL,
  };
});
