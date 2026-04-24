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

export const fetchContributions = (): Promise<ContributionsResponse> =>
  fetcher(`${BASE}/contributions/${USERNAME}`);

export const fetchPinnedRepos = (): Promise<PinnedRepo[]> =>
  fetcher(`${BASE}/pinned/${USERNAME}`);
