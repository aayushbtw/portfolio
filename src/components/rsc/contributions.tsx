import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { Suspense } from "react";
import { Text } from "~/components/primitives/text";
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
    return <Text>Contributions are unavailable right now.</Text>;
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
