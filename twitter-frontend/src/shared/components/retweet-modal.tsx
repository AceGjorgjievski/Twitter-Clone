"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Modal,
  Avatar,
  TextField,
  Button,
  Stack,
  Tooltip,
  Popover,
} from "@mui/material";
import { Tweet } from "@/types";
import { useAuthContext } from "@/auth/hooks";
import TweetItem from "./tweet-item";
import ImageIcon from "@mui/icons-material/Image";
import ImagePreviewer from "@/sections/home/image-previewer";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import { EMOJIS } from "@/sections/home/emojis-data";
import { urlToFile } from "@/utils/helpers/file.helper";

type Props = {
  tweet: Tweet;
  open: boolean;
  onClose: () => void;
  onSubmit?: (description?: string, images?: File[]) => void;
  isEdit?: boolean;
};

export default function RetweetModal({
  tweet,
  open,
  onClose,
  onSubmit,
  isEdit = false,
}: Props) {
  const { user } = useAuthContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState(
    isEdit ? tweet.description : ""
  );
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLElement | null>(null);
  const imagePreviewsRef = useRef<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (!isEdit || !tweet.images?.length) return;

    const loadImages = async () => {
      const files = await Promise.all(
        tweet.images.map((url) => urlToFile(url))
      );

      setImages(files);

      imagePreviewsRef.current = tweet.images.map(
        (url) => `${process.env.NEXT_PUBLIC_BACKEND_ROOT_API}${url}`
      );

    };

    loadImages();
  }, [isEdit, tweet.images]);

  const handlePost = () => {
    onSubmit?.(description, images);
    setDescription("");
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remainingSlots = 5 - images.length;
    const selectedFiles = files.slice(0, remainingSlots);

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));

    imagePreviewsRef.current = [...imagePreviewsRef.current, ...newPreviews];

    setImages((prev) => [...prev, ...selectedFiles]);


    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewsRef.current[index]);

    imagePreviewsRef.current = imagePreviewsRef.current.filter(
      (_, i) => i !== index
    );

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const renderButtons = (
    <Box
      sx={{
        display: "flex",
        padding: 2,
        ml: 4,
        gap: 2,
      }}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
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
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: 520,
          bgcolor: "white",
          borderRadius: 3,
          p: 2,
          boxShadow: 10,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {!isEdit && (
            <Avatar
              src={
                typeof user?.profilePicture === "string"
                  ? user.profilePicture
                  : "/images/user-default-avatar.png"
              }
            />
          )}
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="Add a comment"
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Stack>

        {imagePreviewsRef.current.length > 0 && (
          <ImagePreviewer
            imagePreviews={imagePreviewsRef.current}
            onDelete={handleDeleteImage}
          />
        )}

        <Box
          sx={{
            mt: 2,
            ml: 6,
            borderLeft: "2px solid #e0e0e0",
            pl: 2,
          }}
        >
          {!isEdit && <TweetItem tweet={tweet} disabledButtons={true} />}
        </Box>

        {renderButtons}

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1}
          sx={{ mt: 2 }}
        >
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handlePost}>
            {isEdit ? "Update" : "Post"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
