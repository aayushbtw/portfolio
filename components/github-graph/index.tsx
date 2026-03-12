import { unstable_cache } from "next/cache";
import { Suspense } from "react";
import { octo } from "@/lib/octo";
import { GithubGraphClient, GithubGraphClientFallback } from "./client";

const lastYear = new Date().getFullYear() - 1;

const getContributions = unstable_cache(
  () => octo.contributions(lastYear),
  ["github-contributions"],
  { revalidate: 86_400 }
);

function GithubGraph() {
  const contributions = getContributions();

  return (
    <div className="mt-[1.6em]">
      <Suspense fallback={<GithubGraphClientFallback />}>
        <GithubGraphClient contributions={contributions} />
      </Suspense>
    </div>
  );
}

export { GithubGraph };
