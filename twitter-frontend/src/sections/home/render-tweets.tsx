import { loadTweets, loadTweetsWhenUserLoggedIn } from "@/services";
import { Tweet } from "@/types";
import { useEffect, useRef } from "react";
import { useInfiniteTweets } from "@/hooks";
import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import { useAuthContext } from "@/auth/hooks";
import { Box, Typography } from "@mui/material";
import { TweetItem } from "@/shared/components";

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
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Typography>Loading more tweets...</Typography>
      </Box>
    );
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

      {isFetchingNextPage && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Typography>Loading more tweets...</Typography>
        </Box>
      )}
    </>
  );
}
