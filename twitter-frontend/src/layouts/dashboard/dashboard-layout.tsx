"use client";

import { Box } from "@mui/material";
import RightPanel from "./right-panel";
import LeftPanel from "./left-panel";
import LeftPanelToggle from "./left-panel-toggle";
import { usePathname } from "@/routes/hooks";
import { paths } from "@/routes/paths";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayoutView({ children }: Props) {
  const pathName = usePathname();

  const isProfilePage =
    pathName === paths.profile() || pathName.startsWith("/profile/");

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <LeftPanel />
      <LeftPanelToggle />

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        {children}
      </Box>
      {!isProfilePage && <RightPanel />}
    </Box>
  );
}
