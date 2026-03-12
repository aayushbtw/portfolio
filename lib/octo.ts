import { getCloudflareContext } from "@opennextjs/cloudflare";
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

function fetchPath(path: string): Promise<Response> {
  if (process.env.OCTO_API_URL) {
    return fetch(`${process.env.OCTO_API_URL}${path}`);
  }
  const { env } = getCloudflareContext();
  return env.OCTO.fetch(new Request(`https://octo${path}`));
}

async function request<T>(path: string): Promise<OctoResponse<T>> {
  try {
    const res = await fetchPath(path);

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
