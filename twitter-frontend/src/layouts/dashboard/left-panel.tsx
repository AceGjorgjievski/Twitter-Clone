import { DrawerItem } from "@/types";
import {
  Drawer,
  List,
  Tooltip,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { drawerItems } from "./dashboard.data";
import { useSidebarContext } from "@/components/context";
import { useAuthContext } from "@/auth/hooks";
import { usePathname, useRouter } from "@/routes/hooks";

export default function LeftPanel() {
  const router = useRouter();
  const pathName = usePathname();

  const { isCollapsed, toggleCollapse } = useSidebarContext();
  const { authenticated } = useAuthContext();

  const drawerWidth = isCollapsed ? 90 : 240;

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
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
        {drawerItems
          .filter((item) => {
            if (!authenticated)
              return item.label === "Home" || item.label === "Profile";
            else return true;
          })
          .map((item: DrawerItem, index) => {
            const selected = pathName === item.path;
            return (
              <Tooltip
                key={index}
                placement="right"
                arrow
                title={
                  !authenticated && item.label === "Profile"
                    ? "Login Now!"
                    : item.label
                }
              >
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
              </Tooltip>
            );
          })}
      </List>
    </Drawer>
  );
}
