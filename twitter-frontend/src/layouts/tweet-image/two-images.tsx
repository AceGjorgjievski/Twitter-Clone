import { Box } from "@mui/material";
import Image from "next/image";

type TwoImagesProps = {
  images: string[];
  tweetId: number | string;
  onImageClick: () => void;
};

export default function TwoImages({
  images,
  tweetId,
  onImageClick,
}: TwoImagesProps) {
  return (
    <Box
      sx={{
        marginLeft: "3rem",
        marginRight: "1rem",
        marginBottom: 1,
        display: "flex",
        gap: 1,
        maxWidth: 500,
      }}
    >
      {images.slice(0, 2).map((img, i) => (
        <Box
          key={`${tweetId}-${i}`}
          sx={{
            flex: 1,
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #eee",
            cursor: "pointer",
          }}
          onClick={onImageClick}
        >
          <Image
            src={`http://localhost:4000${img}`}
            alt={`tweet ${i + 1}`}
            width={250}
            height={300}
            quality={85}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
