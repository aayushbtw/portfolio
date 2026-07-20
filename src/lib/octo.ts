import { createServerOnlyFn } from "@tanstack/react-start";
import type { Activity } from "~/components/ui/contribution-graph";
import { config } from "~/lib/config";

const USERNAME = config.socials.github;
const BASE = "https://octo.aayush.cv";

export interface ContributionsResponse {
  contributions: Activity[];
  total: number;
  year: number;
}

export interface PinnedRepo {
  description: string;
  forks: number;
  language: string;
  repo: string;
  stars: number;
  url: string;
}

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`octo: ${url} responded with ${res.status}`);
  }
  return res.json() as Promise<T>;
};

// Server-only so the octo endpoint and its shape are stripped from the client
// bundle rather than surviving on tree-shaking luck.
export const fetchContributions = createServerOnlyFn(
  (): Promise<ContributionsResponse> =>
    fetcher(`${BASE}/contributions/${USERNAME}`)
);

export const fetchPinnedRepos = createServerOnlyFn(
  (): Promise<PinnedRepo[]> => fetcher(`${BASE}/pinned/${USERNAME}`)
);
