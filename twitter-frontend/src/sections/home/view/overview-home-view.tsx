"use client";

import { Box, Typography } from "@mui/material";
import RenderTweets from "../render-tweets";
import { useState } from "react";
import CreateTweet from "../create-tweet";

export default function HomeView() {
  const [refresh, setRefresh] = useState(0);
  const onTweetCreated = () => {
    setRefresh((prev) => prev + 1);
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
      <RenderTweets renderTweets={refresh} />
    </>
  );
}
