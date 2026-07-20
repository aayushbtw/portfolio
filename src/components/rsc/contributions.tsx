import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { Suspense } from "react";
import {
  ContributionGraph,
  ContributionGraphSkeleton,
} from "~/components/ui/contribution-graph";
import { fetchContributions } from "~/lib/octo";

async function Contributions() {
  const { contributions, total } = await fetchContributions();

  return <ContributionGraph data={contributions} total={total} />;
}

const contributionsFn = createServerFn({ method: "GET" }).handler(() =>
  renderServerComponent(
    <Suspense fallback={<ContributionGraphSkeleton />}>
      <Contributions />
    </Suspense>
  )
);

function getContributions() {
  return contributionsFn();
}

export { getContributions };
