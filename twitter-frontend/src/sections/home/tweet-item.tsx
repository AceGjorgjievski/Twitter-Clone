import { TweetImageLayout } from "@/layouts/tweet-image";
import { ImagePreviewModal, RenderTweetButtons } from "@/shared/components";
import { Tweet } from "@/types";
import { Box, Typography, Avatar, Stack } from "@mui/material";
import { useState } from "react";

type Props = {
  tweet: Tweet;
};

export default function TweetItem({ tweet }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const renderTweetInfo = (
    <Stack
      direction={"column"}
      sx={{
        marginLeft: "0.5rem",
        marginTop: "0.1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <Typography sx={{}} fontWeight="bold">
          {tweet.author.name.split(" ")[0]}
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          @{tweet.author.name.toLowerCase().replace(/\s+/g, "")}
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          {" "}
          •{" "}
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          {new Date(tweet.createdAt).toLocaleString()}
        </Typography>
      </Box>

      <Typography>{tweet.description}</Typography>
    </Stack>
  );

  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        minHeight: "100px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          padding: 2,
        }}
      >
        <Avatar
          src={tweet.author.profilePicture}
          alt={"/images/user-default-avatar.png"}
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#cfd9de",
            flexShrink: 0,
          }}
        />
        {renderTweetInfo}
      </Box>

      <TweetImageLayout
        images={tweet.images}
        tweetId={tweet.id}
        onImageClick={() => setModalOpen(true)}
      />
      <ImagePreviewModal
        tweet={tweet}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <RenderTweetButtons tweet={tweet} />
    </Box>
  );
}
