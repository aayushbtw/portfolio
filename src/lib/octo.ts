import type { Activity } from "@/components/ui/contribution-graph";
import { config } from "@/lib/config";

const USERNAME = config.socials.github;
const BASE = "https://octo.aayush.page";

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

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`octo: ${url} responded with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function fetchContributions(
  year: number
): Promise<ContributionsResponse> {
  return fetcher(`${BASE}/contributions/${USERNAME}?y=${year}`);
}

export function fetchPinnedRepos(): Promise<PinnedRepo[]> {
  return fetcher(`${BASE}/pinned/${USERNAME}`);
}
