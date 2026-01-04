import { loadTweets } from "@/services";
import { Tweet } from "@/types";
import { useEffect, useRef } from "react";
import TweetItem from "../../shared/components/tweet-item";
import { useInfiniteTweets } from "@/hooks";

type Props = {
  renderTweets: number;
};

export default function RenderTweets({ renderTweets }: Props) {
  const loaderRef = useRef<HTMLDivElement>(null);

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } =
  useInfiniteTweets(["tweets-feed"], loadTweets, 5);
  const allTweets: Tweet[] = data?.pages.flatMap((page) => page.tweets) || [];

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


  if (isLoading) {
    return <p>Loading initial tweets...</p>;
  }

  if (status === "error") {
    return <p>Error: {error?.message}</p>;
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
