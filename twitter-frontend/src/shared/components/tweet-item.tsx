import { TweetImageLayout } from "@/layouts/tweet-image";
import { ImagePreviewModal, RenderTweetButtons } from "@/shared/components";
import { Tweet } from "@/types";
import { Box, Typography, Avatar, Stack, Card, Link } from "@mui/material";
import { useState } from "react";

type Props = {
  tweet: Tweet;
  onImageClick?: (e: React.MouseEvent) => void;
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
          {tweet.author?.name.split(" ")[0]}
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          @{tweet?.author?.name.toLowerCase().replace(/\s+/g, "")}
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
            fontSize: 15,
          }}
        >
          {new Date(
            tweet?.createdAt ?? tweet?.retweetOf?.createdAt
          ).toLocaleString()}
        </Typography>
      </Box>

      <Typography>{tweet?.description}</Typography>
    </Stack>
  );

  const renderRetweetInfo = (
    <>
      {tweet.retweetOf ? (
        <Box sx={{ borderLeft: "2px solid #eee", ml: 6, pl: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Retweeted
          </Typography>

          <Typography variant="body2" color="text.primary">
            {tweet.retweetOf?.description}
          </Typography>

          <Link href={`/tweet/${tweet.retweetOf.id}`}>View original tweet</Link>
          <TweetImageLayout
            images={tweet.images}
            tweetId={tweet.retweetOf.id}
            onImageClick={() => setModalOpen(true)}
          />
          <ImagePreviewModal
            tweet={tweet}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </Box>
      ) : null}
    </>
  );

  return (
    <Box
      sx={{
        minHeight: "100px",
        marginBottom: "1rem",
      }}
    >
      <Card
        sx={{
          boxShadow: 5,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            padding: 2,
          }}
        >
          <Avatar
            src={tweet.author?.profilePicture}
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
        {renderRetweetInfo}

        <RenderTweetButtons tweet={tweet} />
      </Card>
    </Box>
  );
}
