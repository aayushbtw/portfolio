import type { Activity } from "@/components/kibo-ui/contribution-graph";
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

export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`octo: ${url} responded with ${res.status}`);
  }
  return res.json() as Promise<T>;
};

export const octo = {
  contributions: (year: number) =>
    `${BASE}/contributions/${USERNAME}?y=${year}`,
  pinned: `${BASE}/pinned/${USERNAME}`,
};
