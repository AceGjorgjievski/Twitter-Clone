import { useAuthContext } from "@/auth/hooks";
import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";

export default function RightPanel() {
  const { user, authenticated } = useAuthContext();
  const router = useRouter();

  const renderProfile = (
    <Stack spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
      <Avatar
        src={user?.profilePicture || "/images/default-avatar.png"}
        alt={user?.name || "User"}
        sx={{
          width: 80,
          height: 80,
        }}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {user?.name}
      </Typography>

      <Button
        variant="contained"
        sx={{
          borderRadius: "999px",
          textTransform: "none",
          fontWeight: 500,
          px: 3,
        }}
        onClick={() => router.push(paths.profile())}
      >
        View profile
      </Button>
    </Stack>
  );

  const renderLoginRegisterButtons = (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <Button
        variant="contained"
        sx={{
          borderRadius: "800px",
          textTransform: "none",
          fontWeight: 300,
          width: "150px",
        }}
        onClick={() => router.replace(paths.login())}
      >
        Login
      </Button>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontWeight: 500 }}
      >
        or
      </Typography>
      <Button
        variant="contained"
        sx={{
          borderRadius: "800px",
          textTransform: "none",
          fontWeight: 300,
          width: "150px",
        }}
        onClick={() => router.replace(paths.register())}
      >
        Register
      </Button>
    </Container>
  );

  return (
    <Box
      sx={{
        borderLeft: "1px solid #e6ecf0",
        width: "350px",
        marginTop: "2rem",
      }}
    >
      {authenticated ? renderProfile : renderLoginRegisterButtons}
    </Box>
  );
}
