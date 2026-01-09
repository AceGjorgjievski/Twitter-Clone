
import { Box, Typography, Avatar, Stack, Card, Link } from "@mui/material";

import ActionsMenu from "./actions-menu";
import RetweetModal from "./retweet-modal";

import { TweetImageLayout } from "@/layouts/tweet-image";
import { ImagePreviewModal, RenderTweetButtons } from "@/shared/components";
import { Tweet } from "@/types";

import { deleteTweet, editTweet } from "@/services";
import { useTweetQueries } from "@/hooks";
import { useState } from "react";
import { useAuthContext } from "@/auth/hooks";


type Props = {
  tweet: Tweet;
  onImageClick?: (e: React.MouseEvent) => void;
  disabledButtons?: boolean;
};

export default function TweetItem({ tweet, disabledButtons = false }: Props) {
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const { authenticated, user } = useAuthContext();
  const { refreshAllTweetData, refreshTweet } = useTweetQueries(
    Number(user?.id)
  );

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleClose = () => {
    setEditModalOpen(false);
  };

  const handleEditSubmit = async (description?: string, images?: File[]) => {
    try {
      const formData = new FormData();

      if (description) {
        formData.append("description", description);
      }

      if (images) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const res = await editTweet(tweet.id, formData);
      await Promise.all([refreshAllTweetData(), refreshTweet(tweet.id)]);
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleImagePreviewClose = () => {
    setEditModalOpen(false);
    setImageModalOpen(false);
  };

  const handleDelete = async () => {
    await deleteTweet(tweet.id);
    await refreshAllTweetData();
  };

  const actionItems = [
    {
      label: "Edit",
      onClick: handleEdit,
    },
    {
      label: "Delete",
      onClick: handleDelete,
    },
  ];

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
        onClick={(e) => {
          e.stopPropagation();
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

        {authenticated && tweet.author.id === user?.id && !disabledButtons && (
          <ActionsMenu options={actionItems} />
        )}

        <RetweetModal
          tweet={tweet}
          open={editModalOpen}
          isEdit={true}
          onClose={handleClose}
          onSubmit={(description, images) => {
            handleEditSubmit(description, images);
          }}
        />
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
          {/* <TweetImageLayout
            images={tweet.images}
            tweetId={tweet.retweetOf.id}
            onImageClick={() => setImageModalOpen(true)}
          /> */}
          {/* <ImagePreviewModal
            tweet={tweet}
            open={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          /> */}
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
          onImageClick={() => setImageModalOpen(true)}
        />
        <ImagePreviewModal
          tweet={tweet}
          open={imageModalOpen}
          onClose={handleImagePreviewClose}
        />
        {renderRetweetInfo}

        <RenderTweetButtons tweet={tweet} disabledButtons={disabledButtons} />
      </Card>
    </Box>
  );
}
