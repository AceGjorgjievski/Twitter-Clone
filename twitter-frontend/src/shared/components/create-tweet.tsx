"use client";

import { Box, Button, TextField, Popover } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import { useState, useRef } from "react";
import { EMOJIS } from "./emojis-data";

export default function CreateTweet() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLElement | null>(null);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        borderBottom: "1px solid #e6ecf0",
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: "#cfd9de",
          flexShrink: 0,
        }}
      />

      <Box sx={{ flexGrow: 1 }}>
        <TextField
          variant="standard"
          placeholder="What's happening?"
          fullWidth
          multiline
          maxRows={4}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 280))}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: "1.1rem",
              color: "#0f1419",
            },
          }}
        />

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
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImage(file);
              }}
            />

            <Box
              sx={{ cursor: "pointer", color: "#1d9bf0" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon />
            </Box>
            <Box
              sx={{ cursor: "pointer", color: "#1d9bf0" }}
              onClick={(e) => setEmojiAnchor(e.currentTarget)}
            >
              <EmojiEmotionsOutlinedIcon />
            </Box>
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
                {EMOJIS.map(
                  (emoji) => (
                    <Box
                      key={emoji}
                      sx={{ cursor: "pointer", fontSize: "1.3rem" }}
                      onClick={() => {
                        setText((prev) => (prev + emoji).slice(0, 280));
                        setEmojiAnchor(null);
                      }}
                    >
                      {emoji}
                    </Box>
                  )
                )}
              </Box>
            </Popover>
          </Box>

          <Button
            sx={{
              borderRadius: "999px",
            }}
            variant="contained"
          >
            Tweet
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
