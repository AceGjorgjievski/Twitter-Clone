"use client";

import { Box } from "@mui/material";
import RightPanel from "./right-panel";
import LeftPanel from "./left-panel";
import LeftPanelToggle from "./left-panel-toggle";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayoutView({ children }: Props) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <LeftPanel />
      <LeftPanelToggle />

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        {children}
      </Box>
      <RightPanel />
    </Box>
  );
}
