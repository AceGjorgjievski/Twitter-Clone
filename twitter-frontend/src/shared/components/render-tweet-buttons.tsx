import { Box, colors, Tooltip } from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import { useAuthContext } from "@/auth/hooks";
import { likeTweet, retweet } from "@/services";
import { Tweet } from "@/types";

import { JSX, useState } from "react";
import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import { useQueryClient } from "@tanstack/react-query";
import RetweetModal from "./retweet-modal";

type Props = {
  tweet: Tweet;
};

type TweetButtonConfig = {
  key: string;
  icon: JSX.Element;
  hoverColor: string;
  totalCount?: number;
  onClick: () => void;
};

const renderButtons = (
  isLiked: boolean,
  tweet: Tweet,
  totalLikes: number,
  retweetedCount: number,
  handlers: {
    onLike: () => void;
    onComment: () => void;
    onRepost: () => void;
  }
): TweetButtonConfig[] => [
  {
    key: "like",
    icon: isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />,
    hoverColor: colors.pink[800],
    totalCount: totalLikes,
    onClick: handlers.onLike,
  },
  {
    key: "comment",
    icon: <ChatBubbleOutlineIcon />,
    hoverColor: colors.cyan[500],
    totalCount: tweet.comments?.length,
    onClick: handlers.onComment,
  },
  {
    key: "repost",
    icon: <AutorenewIcon />,
    hoverColor: colors.green[600],
    totalCount: retweetedCount,
    onClick: handlers.onRepost,
  },
];

export default function RenderTweetButtons({ tweet }: Props) {
  const { user, authenticated } = useAuthContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [previewUpdateTrigger, setPreviewUpdateTrigger] = useState(0);
  const [isLiked, setIsLiked] = useState<boolean>(
    !!tweet.likedBy?.find((u) => u.id === user?.id)
  );
  const [open, setOpen] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState<boolean>(tweet.isRetweeted);
  const [totalLikes, setTotalLikes] = useState<number>(tweet.totalLikes);
  const displayRetweetCount = tweet.retweetOf
    ? tweet.retweetOf.retweetCount
    : tweet.retweetCount;

  const triggerUpdate = () => {
    setPreviewUpdateTrigger((prev) => prev + 1);
  };

  const handleLike = async () => {
    if (!authenticated) router.push(paths.login());

    setIsLiked((prev) => !prev);
    setTotalLikes((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const res = await likeTweet(tweet.id, user?.id as number);

      setIsLiked(res.liked);
      setTotalLikes(res.totalLikes);

      queryClient.invalidateQueries({ queryKey: ["tweets-feed"] });
      queryClient.invalidateQueries({ queryKey: ["profile-tweets", user?.id] });
      queryClient.invalidateQueries({
        queryKey: ["profile-liked-tweets", user?.id],
      });
    } catch (err) {
      setIsLiked((prev) => !prev);
      setTotalLikes((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  const handleComment = () => {};

  const handleRetweetSubmit = async (description?: string, images?: File[]) => {
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

      const res = await retweet(tweet.id, formData);
      if (res) {
        setIsRetweeted(res.retweeted);
      }

      queryClient.invalidateQueries({ queryKey: ["tweets-feed"] });
      queryClient.invalidateQueries({ queryKey: ["profile-tweets", user?.id] });
      triggerUpdate();
      setOpen(false);
    } catch (err) {
      console.error("Retweet failed", err);
      setIsRetweeted((prev) => !prev);
    }
  };

  const handleRepost = async () => {
    if (!authenticated) {
      router.push(paths.login());
      return;
    }

    if (isRetweeted) {
      setIsRetweeted(false);

      try {
        const res = await retweet(tweet.id, new FormData());
        setIsRetweeted(res.retweeted);
        if (!res.retweeted) {
          queryClient.invalidateQueries({ queryKey: ["tweets-feed"] });
          queryClient.invalidateQueries({
            queryKey: ["profile-tweets", user?.id],
          });
        }
      } catch (err) {
        setIsRetweeted(true);
      }
      return;
    }

    setOpen(true);
  };

  const buttons = renderButtons(
    isLiked,
    tweet,
    totalLikes,
    displayRetweetCount,
    {
      onLike: handleLike,
      onComment: handleComment,
      onRepost: handleRepost,
    }
  );

  const getButtonColor = (key: string) => {
    if (key === "like" && isLiked) return colors.pink[800];
    if (
      key === "repost" &&
      isRetweeted &&
      tweet &&
      tweet?.author?.id === user?.id
    )
      return colors.green[600];
    return "text.secondary";
  };

  return (
    <Box
      sx={{
        display: "flex",
        marginLeft: "3.8rem",
        marginBottom: 1,
        gap: 5,
      }}
    >
      {buttons.map((btn) => (
        <Box
          key={btn.key}
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <Tooltip title={btn.key} arrow>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                btn.onClick();
              }}
              sx={{
                cursor: "pointer",
                color: getButtonColor(btn.key),
                "&:hover": {
                  color: btn.hoverColor,
                },
              }}
            >
              {btn.icon}
            </Box>
          </Tooltip>

          {typeof btn.totalCount === "number" && (
            <Box component="span" sx={{ fontSize: 14 }}>
              {btn.totalCount}
            </Box>
          )}
        </Box>
      ))}
      <RetweetModal
        tweet={tweet}
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(description, images) => {
          handleRetweetSubmit(description, images);
        }}
      />
    </Box>
  );
}
