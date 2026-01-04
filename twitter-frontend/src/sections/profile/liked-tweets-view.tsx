import { useInfiniteTweets } from "@/hooks";
import { loadLikedTweetsForCurrentUser } from "@/services";
import { TweetItem } from "@/shared/components";
import { User } from "@/types";
import { Card, CardHeader, Stack, Box, Divider, Grid } from "@mui/material";
import { useEffect, useRef } from "react";

type Props = {
  user: User;
};

export default function LikedTweetsView({ user }: Props) {
  const loaderRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteTweets(
      ["profile-liked-tweets", user?.id],
      loadLikedTweetsForCurrentUser,
      5
    );

  const tweets = data?.pages.flatMap((p) => p.tweets) ?? [];

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetching) {
        fetchNextPage();
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching, fetchNextPage]);

  if (isLoading) return <p>Loading liked tweets…</p>;

  const renderTotalLikedTweetsInfo = (
    <Card
      sx={{
        py: 3,
        textAlign: "center",
        typography: "h4",
        boxShadow: 5,
        borderRadius: 3,
      }}
    >
      <Stack
        direction="row"
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderStyle: "dashed" }}
          />
        }
      >
        <Stack width={1}>
          {tweets.length}
          <Box
            component="span"
            sx={{ color: "text.secondary", typography: "body2" }}
          >
            Total Liked Tweets
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderProfileTweets = (
    <>
      <CardHeader title="My Liked Tweets" />
      {tweets.map((tweet) => (
        <TweetItem key={tweet.id} tweet={tweet} />
      ))}
    </>
  );

  return (
    <>
      <Grid
        container
        spacing={6}
        sx={{
          padding: 3,
        }}
      >
        <Grid component={"div"} size={{ xs: 12, md: 4 }}>
          <Stack spacing={4}>{renderTotalLikedTweetsInfo}</Stack>
        </Grid>

        <Grid component={"div"} size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>{renderProfileTweets}</Stack>
        </Grid>
      </Grid>
    </>
  );
}
