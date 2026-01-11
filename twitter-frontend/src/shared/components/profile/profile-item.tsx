import { paths } from "@/routes/paths";
import { User } from "@/types";
import { Grid, Card, Box, Avatar, Typography, Button } from "@mui/material";
import { useRouter } from "@/routes/hooks";

type Props = {
  user: User;
  handleRemoveFun: (userId: number) => void;
  hideButton?: boolean;
};

export default function ProfileItem({
  user,
  handleRemoveFun,
  hideButton = false,
}: Props) {
  const router = useRouter();

  const renderUserHeader = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        marginBottom: 2,
      }}
    >
      <Avatar
        src={user?.profilePicture}
        alt={user?.name || "User"}
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#cfd9de",
          flexShrink: 0,
          cursor: "pointer",
        }}
      />

      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight="bold" noWrap>
          {user?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          @{user?.slug}
        </Typography>
      </Box>
    </Box>
  );

  const renderUserInfo = (
    <>
      <Typography variant="body2" paragraph>
        {user?.email}
      </Typography>

      <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Role
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {user.role}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Joined
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {new Date(user?.createdAt as string).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    </>
  );

  const renderButtons = (
    <Box
      component={"div"}
      gap={2}
      sx={{
        display: "flex",
        maxWidth: "300px",
        justifyContent: "space-between",
      }}
    >
      <Button
        variant="contained"
        size="small"
        onClick={() => {
          router.push(paths.userProfile(user?.slug));
        }}
      >
        <Typography
          sx={{
            fontSize: "10px",
          }}
        >
          View Profile
        </Typography>
      </Button>
      {!hideButton && (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleRemoveFun(user?.id)}
        >
          <Typography
            sx={{
              fontSize: "10px",
            }}
          >
            Remove
          </Typography>
        </Button>
      )}
    </Box>
  );

  return (
    <Grid component={"div"} xs={12} sm={6} md={6} lg={6} key={user.id}>
      <Card
        sx={{
          boxShadow: 5,
          borderRadius: 3,
          height: "100%",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 8,
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: 3,
            height: "100%",
          }}
        >
          {renderUserHeader}

          <Box sx={{ flex: 1 }}>
            {renderUserInfo}
            {renderButtons}
          </Box>
        </Box>
      </Card>
    </Grid>
  );
}
