import { useSidebarContext } from "@/components/context";
import { Box, IconButton } from "@mui/material";

import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

export default function LeftPanelToggle() {
  const { isCollapsed, toggleCollapse } = useSidebarContext();

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: isCollapsed ? 68 : 220,
        transition: "left 0.3s ease",
        zIndex: 3,
      }}
    >
      <IconButton
        onClick={() => toggleCollapse()}
        sx={{
          background: "#fff",
          boxShadow: 5,
          borderRadius: "50%",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        {isCollapsed ? (
          <KeyboardDoubleArrowRightIcon />
        ) : (
          <KeyboardDoubleArrowLeftIcon />
        )}
      </IconButton>
    </Box>
  );
}
