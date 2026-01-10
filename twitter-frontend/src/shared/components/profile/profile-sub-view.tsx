import { TweetItem } from "@/shared/components";
import { Tweet, User } from "@/types";
import { Card, CardHeader, Stack, Box, Divider, Grid } from "@mui/material";

type Props = {
  user: User;
  tweets: Tweet[];
  isFetchingNextPage?: boolean;
};

export default function ProfileSubView({
  user,
  tweets,
  isFetchingNextPage,
}: Props) {
  const renderFollows = (
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
          {/* {fNumber(info.totalFollowers)} */}
          1500
          <Box
            component="span"
            sx={{ color: "text.secondary", typography: "body2" }}
          >
            Follower
          </Box>
        </Stack>

        <Stack width={1}>
          {/* {fNumber(info.totalFollowing)} */}
          3000
          <Box
            component="span"
            sx={{ color: "text.secondary", typography: "body2" }}
          >
            Following
          </Box>
        </Stack>
      </Stack>
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
          {/* {fNumber(info.totalFollowers)} */}
          1500
          <Box
            component="span"
            sx={{ color: "text.secondary", typography: "body2" }}
          >
            Liked Tweets
          </Box>
        </Stack>

        <Stack width={1}>
          {/* {fNumber(info.totalFollowing)} */}
          3000
          <Box
            component="span"
            sx={{ color: "text.secondary", typography: "body2" }}
          >
            Re tweets
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderAbout = (
    <Card
      sx={{
        boxShadow: 5,
        borderRadius: 3,
      }}
    >
      <CardHeader title="About Me" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" spacing={2}>
          <Box sx={{ typography: "body2" }}>{`Name: ${user.name}`}</Box>
        </Stack>

        <Stack direction="row" sx={{ typography: "body2" }}>
          {`Email: ${user?.email}`}
        </Stack>

        <Stack direction="row" spacing={2}>
          <Box sx={{ typography: "body2" }}>
            {`Current role: ${user?.role}`}
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          {user.createdAt && (
            <Box sx={{ typography: "body2" }}>
              Joined at: {new Date(user.createdAt).toLocaleDateString()}
            </Box>
          )}
        </Stack>
      </Stack>
    </Card>
  );

  const renderProfileTweets = (
    <>
      <CardHeader
        title={
          tweets.length > 0 ? "My Tweets" : "You haven't posted anything yet."
        }
      />
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
          <Stack spacing={4}>
            {renderFollows}
            {renderAbout}
          </Stack>
        </Grid>

        <Grid component={"div"} size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>{renderProfileTweets}</Stack>
          {isFetchingNextPage && <p>Loading more tweets...</p>}
        </Grid>
      </Grid>
    </>
  );
}
