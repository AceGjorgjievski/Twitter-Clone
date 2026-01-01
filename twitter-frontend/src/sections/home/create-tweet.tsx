"use client";

import {
  Box,
  Button,
  TextField,
  Popover,
  Avatar,
  Tooltip,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import { useState, useRef, useEffect } from "react";
import { EMOJIS } from "./emojis-data";
import { useAuthContext } from "@/auth/hooks";
import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import createTweet from "@/services/tweet.service";
import ImagePreviewer from "./image-previewer";

export default function CreateTweet() {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [limitAnchor, setLimitAnchor] = useState<HTMLElement | null>(null);
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { user, authenticated } = useAuthContext();

  const showTweetButton =
    (authenticated && (description.trim().length > 0 || images.length > 0)) ||
    !authenticated;

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleCreateTweet = async () => {
    if (!authenticated) {
      router.replace(paths.login());
      return;
    }

    const formData = new FormData();
    formData.append("description", description);

    images.forEach((image) => {
      formData.append("images", image);
    });

    await createTweet(formData);
    setDescription("");
    setImages([]);
    setImagePreviews([]);
  };

  const renderAvatar = (
    <Avatar
      src={
        typeof user?.profilePicture === "string"
          ? user.profilePicture
          : "/images/user-default-avatar.png"
      }
      alt={typeof user?.name === "string" ? user.name : "User"}
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "#cfd9de",
        flexShrink: 0,
      }}
    />
  );

  const renderPlaceholder = (
    <>
      <TextField
        variant="standard"
        placeholder={
          authenticated
            ? `What's happening, ${user?.name}?`
            : `What's happening?`
        }
        fullWidth
        multiline
        maxRows={4}
        value={description}
        onChange={(e) => {
          const value = e.target.value.slice(0, 280);
          setDescription(value);

          if (value.length === 280) {
            setLimitAnchor(e.currentTarget);
          } else {
            setLimitAnchor(null);
          }
        }}
        InputProps={{
          disableUnderline: true,
          sx: {
            fontSize: "1.1rem",
            color: "#0f1419",
          },
        }}
      />
      <Popover
        open={Boolean(limitAnchor)}
        anchorEl={limitAnchor}
        onClose={() => setLimitAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        disableRestoreFocus
      >
        <Box
          sx={{
            px: 1.5,
            py: 1,
            fontSize: "0.85rem",
            color: "#fff",
            backgroundColor: "#f4212e",
            borderRadius: 1,
          }}
        >
          You&apos;ve reached the 280 character limit
        </Box>
      </Popover>
    </>
  );

  const renderButtons = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);

            if (!files.length) return;

            const remainingSlots = 3 - images.length;
            const selectedFiles = files.slice(0, remainingSlots);

            const previews = selectedFiles.map((file) =>
              URL.createObjectURL(file)
            );

            setImages((prev) => [...prev, ...selectedFiles]);
            setImagePreviews((prev) => [...prev, ...previews]);
          }}
        />
        <Tooltip placement="bottom" arrow title={"Upload an image."}>
          <Box
            sx={{ cursor: "pointer", color: "#1d9bf0" }}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon />
          </Box>
        </Tooltip>

        <Tooltip placement="bottom" arrow title={"Choose an emoji."}>
          <Box
            sx={{ cursor: "pointer", color: "#1d9bf0" }}
            onClick={(e) => setEmojiAnchor(e.currentTarget)}
          >
            <EmojiEmotionsOutlinedIcon />
          </Box>
        </Tooltip>

        <Popover
          open={Boolean(emojiAnchor)}
          anchorEl={emojiAnchor}
          onClose={() => setEmojiAnchor(null)}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Box
            sx={{
              p: 1,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              maxWidth: 200,
            }}
          >
            {EMOJIS.map((emoji) => (
              <Box
                key={emoji}
                sx={{ cursor: "pointer", fontSize: "1.3rem" }}
                onClick={() => {
                  setDescription((prev) => (prev + emoji).slice(0, 280));
                  setEmojiAnchor(null);
                }}
              >
                {emoji}
              </Box>
            ))}
          </Box>
        </Popover>
      </Box>

      <Button
        sx={{
          borderRadius: "999px",
        }}
        variant="contained"
        disabled={!showTweetButton}
        onClick={handleCreateTweet}
      >
        Tweet
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        borderBottom: "1px solid #e6ecf0",
          borderTop: "1px solid #e6ecf0",
        minWidth: "300px",
      }}
    >
      {renderAvatar}

      <Box sx={{ flexGrow: 1 }}>
        {renderPlaceholder}
        {imagePreviews.length > 0 && (
          <ImagePreviewer
            imagePreviews={imagePreviews}
            onDelete={(index) => {
              setImages((prev) => prev.filter((_, i) => i !== index));
              setImagePreviews((prev) => prev.filter((_, i) => i !== index));
            }}
          />
        )}

        {renderButtons}
      </Box>
    </Box>
  );
}
