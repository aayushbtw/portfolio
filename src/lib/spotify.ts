import { useQuery } from "@tanstack/react-query";

import { getLiveFn } from "~/server/spotify";

/**
 * One key for both readers, so the corner and the music route share a request.
 * `enabled` is per observer: one caller opting out leaves the other's poll up.
 */
function useLive({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    enabled,
    queryFn: () => getLiveFn(),
    queryKey: ["spotify", "live"],
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
    staleTime: 10_000,
  });
}

export { useLive };
