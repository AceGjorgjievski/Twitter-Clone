import { Tweet } from "@/types";
import { Modal, Box, Button } from "@mui/material";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Props = {
  tweet?: Tweet;
  open: boolean;
  onClose: () => void;
  imagePreviews?: string[];
  currentIndex?: number;
};

export default function ImagePreviewModal({
  tweet,
  open,
  onClose,
  imagePreviews,
  currentIndex: initialIndex = 0,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const imagesToShow = useMemo(() => {
    return imagePreviews || tweet?.images || [];
  }, [imagePreviews, tweet?.images]);

  useEffect(() => {
    if (open && imagesToShow.length > 0) {
      setCurrentIndex(initialIndex);
    }
  }, [open, imagesToShow, initialIndex]);

  useEffect(() => {
    if (!open) return;

    if (
      initialIndex !== undefined &&
      initialIndex !== null &&
      initialIndex < imagesToShow.length
    ) {
      setCurrentIndex(initialIndex);
    } else {
      setCurrentIndex(0);
    }
  }, [open, initialIndex, imagesToShow.length]);

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const nextImage = () => {
    if (currentIndex < imagesToShow.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getImageUrl = (imgPath: string) => {
    if (imgPath.startsWith("http") || imgPath.startsWith("blob:")) {
      return imgPath;
    }
    return `http://localhost:4000${imgPath}`;
  };

  const renderPreviousButton = (
    <>
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
    </>
  );
  
  const renderNextButton = (
    <>
      {currentIndex !== null && currentIndex < imagesToShow.length - 1 && (
        <Button
          sx={{
            position: "absolute",
            top: "50%",
            right: -45,
            transform: "translateY(-50%)",
            minWidth: 0,
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "#fff",
            border: "1px solid white",
            width: 40,
            height: 40,
          }}
          onClick={nextImage}
        >
          ▶
        </Button>
      )}
    </>
  );

  const renderCloseButton = (
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
      onClick={onClose}
    >
      ✕
    </Button>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
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
        {currentIndex !== null && imagesToShow[currentIndex] && (
          <Image
            src={getImageUrl(imagesToShow[currentIndex])}
            alt="full preview"
            width={800}
            height={500}
            style={{ width: 850, height: 650, borderRadius: 8 }}
          />
        )}

        {renderCloseButton}

        {renderPreviousButton}

        {renderNextButton}
      </Box>
    </Modal>
  );
}
