import { useInfiniteQuery } from "@tanstack/react-query";
import { loadTweets } from "@/services";
import { Tweet } from "@/types";
import { useEffect, useRef } from "react";
import TweetItem from "./tweet-item";

type Props = {
  renderTweets: number;
};

export default function RenderTweets({ renderTweets }: Props) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const limit = 5;

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["tweets", renderTweets],
    queryFn: ({ pageParam }) => loadTweets(limit, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || null,
  });

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;

    const currentLoader = loaderRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !isFetching &&
          !isFetchingNextPage &&
          hasNextPage
        ) {
          fetchNextPage();
        }
      },
      { rootMargin: "150px" }
    );

    observer.observe(currentLoader);
    return () => observer.unobserve(currentLoader);
  }, [hasNextPage, isFetching, isFetchingNextPage, fetchNextPage]);

  const allTweets: Tweet[] = data?.pages.flatMap((page) => page.tweets) || [];

  if (status === "pending") {
    return <p>Loading initial tweets...</p>;
  }

  if (status === "error") {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <div>
        {allTweets.map((tweet) => (
          <TweetItem key={tweet.id} tweet={tweet} />
        ))}
      </div>

      <div ref={loaderRef} style={{ height: 40 }} />

      {isFetchingNextPage && <p>Loading more tweets...</p>}
      {!hasNextPage && allTweets.length > 0 && <p>No more tweets to load.</p>}
    </>
  );
}
