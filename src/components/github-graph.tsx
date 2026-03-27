import { ContributionGraph } from "@/components/contribution-graph";
import type { ContributionsResponse } from "@/lib/octo";

function GithubGraph({ data }: { data: ContributionsResponse }) {
  return (
    <ContributionGraph
      data={data.contributions}
      total={data.total}
      year={data.year}
    />
  );
}

export { GithubGraph };
