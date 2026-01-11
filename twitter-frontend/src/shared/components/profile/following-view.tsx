import { User } from "@/types";
import { Box, Grid, Typography } from "@mui/material";
import { unfollowUser } from "@/services";
import { useTweetQueries } from "@/hooks";
import { useAuthContext } from "@/auth/hooks";
import ProfileItem from "./profile-item";

type Props = {
  users: User[];
  hideButton?: boolean;
};

export default function FollowingView({ users, hideButton = false }: Props) {
  const { user: currentUser } = useAuthContext();
  const { refreshAllTweetData } = useTweetQueries(Number(currentUser?.id));

  const handleRemoveFollower = async (followerId: number) => {
    try {
      await unfollowUser(followerId);

      await refreshAllTweetData();
    } catch (err) {
      console.error("Error removing following user", err);
    }
  };

  if (!users || users.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100px",
          marginBottom: "1rem",
          marginTop: "1rem",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No Following users found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        marginBottom: "1rem",
        marginTop: "1rem",
        p: 2,
      }}
    >
      <Grid container spacing={2}>
        {users.map((user, index) => (
          <ProfileItem
            key={index || user?.id}
            user={user}
            handleRemoveFun={handleRemoveFollower}
            hideButton={hideButton}
          />
        ))}
      </Grid>
    </Box>
  );
}
