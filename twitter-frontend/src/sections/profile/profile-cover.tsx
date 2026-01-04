import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import { colors } from "@mui/material";

type Props = {
  name: string;
  profilePicture: string;
  role: string;
};

export default function ProfileCover({ name, profilePicture, role }: Props) {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1d9bf0 0%, #0f4c75 100%)",
        px: 3,
        pt: 4,
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} alignItems="center">
        <Avatar
          alt={name}
          src={profilePicture}
          sx={{
            mx: "auto",
            width: { xs: 64, md: 80 },
            height: { xs: 64, md: 80 },
            border: `solid 2px white`,
            color: colors.red[400],
          }}
        >
          {name?.charAt(0).toUpperCase()}
        </Avatar>

        <ListItemText
          sx={{
            mt: 3,
            ml: { md: 3 },
            textAlign: { xs: "center", md: "unset" },
            color: colors.red[400],
          }}
          primary={name}
          secondary={role.toUpperCase()}
          primaryTypographyProps={{
            typography: "h4",
          }}
          secondaryTypographyProps={{
            mt: 0.5,
            color: "inherit",
            component: "span",
            typography: "body2",
            sx: { opacity: 0.48 },
          }}
        />
      </Stack>
    </Box>
  );
}
