import { Box } from "@mui/material";
import Image from "next/image";

type Props = {
  images: string[];
  onImageClick: () => void;
};

export default function SingleImage({ images, onImageClick }: Props) {
  return (
    <Box
      sx={{
        marginLeft: "3rem",
        marginTop: 1,
        display: "flex",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={onImageClick}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #eee",
        }}
      >
        <Image
          src={`http://localhost:4000${images[0]}`}
          alt="tweet"
          width={500}
          height={400}
          quality={85}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
          }}
        />
      </Box>
    </Box>
  );
}
