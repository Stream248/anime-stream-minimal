import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface TrendingAnime {
  malId: number;
  rank: number;
  title: string;
  imageUrl: string;
  score?: number;
  episodes?: number;
  type?: string;
  year?: number;
  members?: number;
  genres: string[];
}

/**
 * Subscribes to the cached trending anime list and asks the backend (once per
 * mount) to refresh it when the cache is empty or older than 6 hours. Loading
 * and error states are derived so pages stay dumb and presentational.
 */
export function useTrendingAnime() {
  const data = useQuery(api.trending.getTrending, {});
  const maybeRefresh = useMutation(api.trending.maybeRefreshTrending);

  useEffect(() => {
    maybeRefresh().catch((err) => {
      console.warn("Trending refresh check failed:", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    anime: (data ?? undefined) as TrendingAnime[] | undefined,
    isLoading: data === undefined,
    isError: false as boolean,
  };
}
