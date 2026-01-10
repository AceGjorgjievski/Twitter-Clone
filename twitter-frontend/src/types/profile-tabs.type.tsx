
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

export type ProfileTab = {
  value: string;
  label: string;
  icon: React.ReactElement;
};

export const PROFILE_TABS: ProfileTab[] = [
  {
    value: "profile",
    label: "Profile",
    icon: <AccountCircleIcon/>,
  },
  {
    value: "liked-tweets",
    label: "Liked Tweets",
    icon: <FavoriteIcon />,
  },
  {
    value: "followers",
    label: "Followers",
    icon: <PeopleAltIcon />,
  },
  {
    value: "following",
    label: "Following",
    icon: <GroupAddIcon />,
  },
];

export const OTHER_USER_TABS: ProfileTab[] = [
  {
    value: "profile",
    label: "Profile",
    icon: <AccountCircleIcon />,
  },
  {
    value: "followers",
    label: "Followers",
    icon: <PeopleAltIcon />,
  },
  {
    value: "following",
    label: "Following",
    icon: <GroupAddIcon />,
  },
];

