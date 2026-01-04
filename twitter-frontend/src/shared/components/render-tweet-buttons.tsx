import { Box, colors, Tooltip } from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import { useAuthContext } from "@/auth/hooks";
import { likeTweet } from "@/services";
import { Tweet } from "@/types";

import { JSX, useState } from "react";
import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import { useQueryClient } from "@tanstack/react-query";

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
    totalCount: tweet.comments?.length,
    onClick: handlers.onRepost,
  },
];

export default function RenderTweetButtons({ tweet }: Props) {
  const { user, authenticated } = useAuthContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState<boolean>(
    !!tweet.likedBy?.find((u) => u.id === user?.id)
  );

  const [totalLikes, setTotalLikes] = useState<number>(tweet.totalLikes);

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

  const handleComment = () => {
    console.log("comment");
  };

  const handleRepost = () => {
    console.log("repost");
  };

  const buttons = renderButtons(isLiked, tweet, totalLikes, {
    onLike: handleLike,
    onComment: handleComment,
    onRepost: handleRepost,
  });

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
              onClick={btn.onClick}
              sx={{
                cursor: "pointer",
                color:
                  btn.key === "like" && isLiked
                    ? colors.pink[800]
                    : "text.secondary",
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
    </Box>
  );
}
