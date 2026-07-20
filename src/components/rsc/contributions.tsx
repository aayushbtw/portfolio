import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { Suspense } from "react";
import {
  ContributionGraph,
  ContributionGraphSkeleton,
} from "~/components/ui/contribution-graph";
import { fetchContributions } from "~/lib/octo";

async function Contributions() {
  // octo is a separate service. If it is down this section degrades on its own
  // instead of rejecting the loader and taking the whole route with it.
  try {
    const { contributions, total } = await fetchContributions();

    return <ContributionGraph data={contributions} total={total} />;
  } catch {
    return (
      <p className="text-fg-3">Contributions are unavailable right now.</p>
    );
  }
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
