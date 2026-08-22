import { createServerFn } from "@tanstack/react-start";
import type { Activity } from "~/components/contribution-graph";
import type { PinnedRepo } from "~/components/project-list";
import { config } from "~/lib/config";

// octo is a separate service that proxies GitHub. Both endpoints degrade to
// `null` rather than throwing, so a rejected loader can't take a route down
// when the service is.
const USERNAME = config.socials.github;
const BASE = "https://octo.aayush.cv";

interface ContributionsResponse {
  contributions: Activity[];
  total: number;
  year: number;
}

async function fetcher<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const getContributions = createServerFn({ method: "GET" }).handler(() =>
  fetcher<ContributionsResponse>(`${BASE}/contributions/${USERNAME}`)
);

const getProjectList = createServerFn({ method: "GET" }).handler(() =>
  fetcher<PinnedRepo[]>(`${BASE}/pinned/${USERNAME}`)
);

export { getContributions, getProjectList };
