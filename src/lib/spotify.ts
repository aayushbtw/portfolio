import { useQuery } from "@tanstack/react-query";
import { getLiveFn } from "~/server/spotify";

/**
 * The music route reads `recentlyPlayed` off the same query key the `__root`
 * corner reads `nowPlaying` from, so the two share one request and one
 * interval. `enabled` is per observer: the corner switching itself off on a
 * phone leaves the music route's own call, and its poll, untouched.
 */
function useLive({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["spotify", "live"],
    queryFn: () => getLiveFn(),
    enabled,
    staleTime: 10_000,
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
  });
}

export { useLive };
