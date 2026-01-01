import { Box, Button, Modal } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

type Props = {
  imagePreviews: string[];
  onDelete: (index: number) => void;
};

export default function ImagePreviewer({ imagePreviews, onDelete }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const openPreview = (index: number) => {
    setCurrentIndex(index);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setCurrentIndex(null);
  };

  const prevImage = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const nextImage = () => {
    if (currentIndex !== null && currentIndex < imagePreviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const renderImagePreviews = (
    <>
      {imagePreviews.map((src, index) => (
        <Box
          key={src}
          sx={{
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #e6ecf0",
            height: 100,
            cursor: "pointer",
          }}
          onClick={() => openPreview(index)}
        >
          <Image
            src={src}
            alt="preview"
            width={100}
            height={100}
            style={{ objectFit: "cover" }}
          />

          <Button
            size="small"
            sx={{
              position: "absolute",
              top: 6,
              right: 6,
              minWidth: 0,
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
          >
            ✕
          </Button>
        </Box>
      ))}
    </>
  );

  const renderModal = (
    <Modal
      open={previewOpen}
      onClose={closePreview}
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          maxWidth: "90%",
          maxHeight: "90%",
          outline: "none",
        }}
      >
        {currentIndex !== null && (
          <Image
            src={imagePreviews[currentIndex]}
            alt="full preview"
            width={500}
            height={500}
            style={{ width: 550, height: 650, borderRadius: 8 }}
          />
        )}

        <Button
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            minWidth: 0,
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "#fff",
            border: "1px solid white",
          }}
          onClick={closePreview}
        >
          ✕
        </Button>

        {currentIndex !== null && currentIndex > 0 && (
          <Button
            sx={{
              position: "absolute",
              top: "50%",
              left: -40,
              transform: "translateY(-50%)",
              minWidth: 0,
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              border: "1px solid white",
            }}
            onClick={prevImage}
          >
            ◀
          </Button>
        )}

        {currentIndex !== null && currentIndex < imagePreviews.length - 1 && (
          <Button
            sx={{
              position: "absolute",
              top: "50%",
              right: -40,
              transform: "translateY(-50%)",
              minWidth: 0,
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              border: "1px solid white",
            }}
            onClick={nextImage}
          >
            ▶
          </Button>
        )}
      </Box>
    </Modal>
  );

  return (
    <>
      <Box
        sx={{
          mt: 1,
          display: "grid",
          gridTemplateColumns: `repeat(${imagePreviews.length}, 100px)`,
          gap: 1,
        }}
      >
        {renderImagePreviews}
      </Box>

      {renderModal}
    </>
  );
}
