import { unstable_cache } from "next/cache";
import { Suspense } from "react";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { GithubCalendar, GithubCalendarFallback } from "./client";

const getContributions = unstable_cache(
  async (): Promise<Activity[]> => {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/aayushbtw?y=last"
    );
    const data = (await res.json()) as { contributions: Activity[] };
    return data.contributions;
  },
  ["github-contributions"],
  { revalidate: 86_400 }
);

function GithubGraph() {
  const contributions = getContributions();
  return (
    <div className="mt-[1.6em]">
      <Suspense fallback={<GithubCalendarFallback />}>
        <GithubCalendar contributions={contributions} />
      </Suspense>
    </div>
  );
}

export { GithubGraph };
