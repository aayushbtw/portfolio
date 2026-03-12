import { unstable_cache } from "next/cache";
import { Suspense } from "react";
import { octo } from "@/lib/octo";
import { GithubGraphClient, GithubGraphClientFallback } from "./client";

const lastYear = new Date().getFullYear() - 1;

const getContributions = unstable_cache(
  async () => {
    console.log({ trace: "octo-debug", source: "github-graph", event: "cache-miss", year: lastYear });
    const result = await octo.contributions(lastYear);
    console.log({ trace: "octo-debug", source: "github-graph", event: "result", ok: result.ok, hasData: result.ok && !!result.data });
    return result;
  },
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
