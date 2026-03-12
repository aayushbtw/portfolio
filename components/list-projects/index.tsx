// import { unstable_cache } from "next/cache";
import { Suspense } from "react";
import { octo } from "@/lib/octo";
import { ListProjectsClient, ListProjectsFallback } from "./client";

// TODO: restore unstable_cache after debugging
// const getPinnedRepos = unstable_cache(
//   async () => {
//     console.log({ trace: "octo-debug", source: "list-projects", event: "cache-miss" });
//     const result = await octo.pinned();
//     console.log({ trace: "octo-debug", source: "list-projects", event: "result", ok: result.ok, hasData: result.ok && !!result.data });
//     return result;
//   },
//   ["github-pinned"],
//   { revalidate: 86_400 }
// );
const getPinnedRepos = () => octo.pinned();

function ListProjects() {
  const projects = getPinnedRepos();

  return (
    <Suspense fallback={<ListProjectsFallback />}>
      <ListProjectsClient projects={projects} />
    </Suspense>
  );
}

export { ListProjects };
