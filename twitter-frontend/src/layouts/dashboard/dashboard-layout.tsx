"use client";

import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { DrawerItem } from "@/types";
import { drawerItems } from "./dashboard.data";

import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useSidebarContext } from "@/components/context";
import { usePathname, useRouter } from "@/routes/hooks";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayoutView({ children }: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebarContext();
  const drawerWidth = isCollapsed ? 90 : 240;

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #e6ecf0",
          },
          zIndex: 1,
        }}
      >
        <List sx={{ mt: 2 }}>
          {drawerItems.map((item: DrawerItem) => {
            const selected = pathName === item.path;
            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: "999px",
                    mx: 2,
                    my: 0.5,
                    "&:hover": {
                      backgroundColor: "#e8f5fd",
                    },
                  }}
                  selected={selected}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: "#0f1419",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: "1.1rem",
                        fontWeight: 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
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

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        {children}
      </Box>
    </Box>
  );
}
