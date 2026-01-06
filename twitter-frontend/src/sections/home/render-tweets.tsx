import { loadTweets, loadTweetsWhenUserLoggedIn } from "@/services";
import { Tweet } from "@/types";
import { useEffect, useRef } from "react";
import TweetItem from "../../shared/components/tweet-item";
import { useInfiniteTweets } from "@/hooks";
import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import { useAuthContext } from "@/auth/hooks";

export default function RenderTweets() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { authenticated } = useAuthContext();
  const queryKey = ["tweets-feed", authenticated ? "loggedIn" : "anonymous"];
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteTweets(
    queryKey,
    authenticated ? loadTweetsWhenUserLoggedIn : loadTweets,
    5
  );
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
          <div
            key={tweet.id}
            onClick={() => router.push(paths.tweetDetails(tweet.id))}
            style={{ cursor: "pointer" }}
          >
            <TweetItem tweet={tweet} />
          </div>
        ))}
      </div>

      <div ref={loaderRef} style={{ height: 40 }} />

      {isFetchingNextPage && <p>Loading more tweets...</p>}
      {!hasNextPage && allTweets.length > 0 && <p>No more tweets to load.</p>}
    </>
  );
}
