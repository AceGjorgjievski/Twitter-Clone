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
import RetweetModal from "./retweet-modal";
import { useTweetQueries } from "@/hooks";

type Props = {
  tweet: Tweet;
  isEdit?: boolean;
  disabledButtons?: boolean;
};

type TweetButtonConfig = {
  key: string;
  icon: JSX.Element;
  hoverColor: string;
  totalCount?: number;
  disabled?: boolean;
  onClick: () => void;
};

export default function RenderTweetButtons({
  tweet,
  disabledButtons = false,
}: Props) {
  const { user, authenticated } = useAuthContext();
  const router = useRouter();
  const { refreshAllTweetData } = useTweetQueries(Number(user?.id));

  const [isLiked, setIsLiked] = useState<boolean>(
    !!tweet.likedBy?.find((u) => u.id === user?.id)
  );
  const [open, setOpen] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState<boolean>(tweet.isRetweeted);
  const [totalLikes, setTotalLikes] = useState<number>(tweet.totalLikes);
  const displayRetweetCount = tweet.retweetOf
    ? tweet.retweetOf.retweetCount
    : tweet.retweetCount;

  const handleClose = () => {
    setOpen(false);
  };

  const handleLike = async () => {
    if (!authenticated) router.push(paths.login());

    setIsLiked((prev) => !prev);
    setTotalLikes((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const res = await likeTweet(tweet.id, user?.id as number);

      setIsLiked(res.liked);
      setTotalLikes(res.totalLikes);

      await refreshAllTweetData();
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

      await refreshAllTweetData();

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
          await refreshAllTweetData();
        }
      } catch (err) {
        setIsRetweeted(true);
      }
      return;
    }
    setOpen(true);
  };

  const getButtons = (): TweetButtonConfig[] => [
    {
      key: "like",
      icon: isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />,
      hoverColor: colors.pink[800],
      totalCount: totalLikes,
      onClick: handleLike,
      disabled: disabledButtons,
    },
    {
      key: "comment",
      icon: <ChatBubbleOutlineIcon />,
      hoverColor: colors.cyan[500],
      totalCount: tweet.comments?.length,
      onClick: handleComment,
      disabled: disabledButtons,
    },
    {
      key: "repost",
      icon: <AutorenewIcon />,
      hoverColor: colors.green[600],
      totalCount: displayRetweetCount,
      onClick: handleRepost,
      disabled: disabledButtons,
    },
  ];

  const buttons = getButtons();

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

  const handleButtonClick = (
    e: React.MouseEvent<HTMLElement>,
    btn: TweetButtonConfig
  ) => {
    e.stopPropagation();

    if (btn.disabled) {
      return;
    }

    btn.onClick();
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
                handleButtonClick(e, btn);
              }}
              sx={{
                cursor: btn.disabled ? "not-allowed" : "pointer",
                color: btn.disabled ? "text.disabled" : getButtonColor(btn.key),
                pointerEvents: btn.disabled ? "none" : "auto",
                "&:hover": {
                  color: btn.disabled ? "text.disabled" : btn.hoverColor,
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
        onClose={handleClose}
        onSubmit={(description, images) => {
          handleRetweetSubmit(description, images);
        }}
      />
    </Box>
  );
}
