import { CreateTweet } from "@/shared/components";
import { Box, Typography } from "@mui/material";

export default function HomeView() {
  return (
    <Box
      sx={{
        borderBottom: "10px solid #e6ecf0",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          fontSize: "1.5rem",
        }}
      >
        Home
      </Typography>
      <CreateTweet />
    </Box>
  );
}
