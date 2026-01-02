import { ImagePreviewModal } from "@/shared/components";
import { Box, Button } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  imagePreviews: string[];
  onDelete: (index: number) => void;
};

export default function ImagePreviewer({ imagePreviews, onDelete }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  useEffect(() => {
    if (currentIndex !== null && currentIndex >= imagePreviews.length) {
      setCurrentIndex(imagePreviews.length - 1);
    }
  }, [imagePreviews.length]);

  const renderImagePreviews = (
    <>
      {imagePreviews.map((src, index) => (
        <Box
          key={`${src}-${index}`}
          sx={{
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #e6ecf0",
            height: 100,
            cursor: "pointer",
          }}
          onClick={() => openModal(index)}
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

      <ImagePreviewModal
        open={modalOpen}
        imagePreviews={imagePreviews}
        currentIndex={currentIndex!}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
