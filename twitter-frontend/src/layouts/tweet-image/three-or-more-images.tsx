import { Box, Typography } from "@mui/material";
import Image from "next/image";

type ThreeOrMoreImagesProps = {
  images: string[];
  onImageClick: () => void;
};

export default function ThreeOrMoreImages({
  images,
  onImageClick,
}: ThreeOrMoreImagesProps) {
  const remainingImages = images.length - 3;
  const imagesToShow = images.slice(0, 3);

  const firstImage = (
    <Box
      sx={{
        flex: 2,
        borderRadius: "12px 0 0 12px",
        overflow: "hidden",
        border: "1px solid #eee",
        borderRight: "0.5px solid #eee",
      }}
    >
      <Image
        src={`http://localhost:4000${imagesToShow[0]}`}
        alt="tweet 1"
        width={333}
        height={300}
        quality={85}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>
  );

  const secondImage = (
    <Box
      sx={{
        flex: 1,
        borderRadius: "0 12px 0 0",
        overflow: "hidden",
        border: "1px solid #eee",
        borderLeft: "0.5px solid #eee",
      }}
    >
      <Image
        src={`http://localhost:4000${imagesToShow[1]}`}
        alt="tweet 2"
        width={166}
        height={145}
        quality={85}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>
  );

  const thirdOrMoreImages = (
    <Box
      sx={{
        flex: 1,
        position: "relative",
        borderRadius: "0 0 12px 0",
        overflow: "hidden",
        border: "1px solid #eee",
        borderLeft: "0.5px solid #eee",
      }}
    >
      {remainingImages > 0 && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              +{remainingImages}
            </Typography>
          </Box>
        </>
      )}

      <Image
        src={`http://localhost:4000${imagesToShow[2]}`}
        alt="tweet 3"
        width={166}
        height={145}
        quality={85}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: remainingImages > 0 ? "brightness(0.8)" : "none",
        }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        marginLeft: "3rem",
        marginRight: "1rem",
        marginBottom: 1,
        display: "flex",
        gap: 1,
        maxWidth: 500,
        height: 300,
        cursor: "pointer",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onImageClick();
      }}
    >
      {firstImage}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {secondImage}

        {thirdOrMoreImages}
      </Box>
    </Box>
  );
}
