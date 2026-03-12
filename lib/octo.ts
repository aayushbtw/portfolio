import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { config } from "@/lib/config";

const USERNAME = config.socials.github;

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

export type OctoResponse<T> = { data: T; ok: true } | { data: null; ok: false };

const OCTO_BASE_URL = process.env.OCTO_API_URL ?? "https://octo.aayush.page";

async function request<T>(path: string): Promise<OctoResponse<T>> {
  try {
    const res = await fetch(`${OCTO_BASE_URL}${path}`);

    if (!res.ok) {
      console.error({
        source: "octo",
        path,
        status: res.status,
        statusText: res.statusText,
      });
      return { data: null, ok: false };
    }

    return { data: (await res.json()) as T, ok: true };
  } catch (error) {
    console.error({ source: "octo", path, error: String(error) });
    return { data: null, ok: false };
  }
}

export const octo = {
  contributions: (year: number) =>
    request<ContributionsResponse>(`/contributions/${USERNAME}?y=${year}`),

  pinned: () => request<PinnedRepo[]>(`/pinned/${USERNAME}`),
};
