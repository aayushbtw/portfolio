import { unstable_cache } from "next/cache";
import { Suspense } from "react";
import { octo } from "@/lib/octo";
import { ListProjectsClient, ListProjectsFallback } from "./client";

const getPinnedRepos = unstable_cache(() => octo.pinned(), ["github-pinned"], {
  revalidate: 86_400,
});

function ListProjects() {
  const projects = getPinnedRepos();

  return (
    <Suspense fallback={<ListProjectsFallback />}>
      <ListProjectsClient projects={projects} />
    </Suspense>
  );
}

export { ListProjects };
