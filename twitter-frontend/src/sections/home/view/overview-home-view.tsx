"use client";

import { Box, Typography } from "@mui/material";
import RenderTweets from "../render-tweets";
import CreateTweet from "../create-tweet";
import { useQueryClient } from "@tanstack/react-query";

export default function HomeView() {
  const queryClient = useQueryClient();
  const onTweetCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["tweets-feed"] });
  };

  return (
    <>
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
        <CreateTweet onTweetCreated={onTweetCreated} />
      </Box>
      <RenderTweets />
    </>
  );
}
