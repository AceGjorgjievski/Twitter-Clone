/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { PaginatedTweet } from "@/types";

type FetchTweetsFn = (limit: number, cursor?: string) => Promise<PaginatedTweet>;

export function useInfiniteTweets(
  queryKey: any[],
  fetchTweetsFn: FetchTweetsFn,
  limit = 5
) {
  return useInfiniteQuery<PaginatedTweet, Error, InfiniteData<PaginatedTweet>, any[], string | null>({
    queryKey,
    queryFn: ({ pageParam }) => fetchTweetsFn(limit, pageParam ?? undefined),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
  });
}
