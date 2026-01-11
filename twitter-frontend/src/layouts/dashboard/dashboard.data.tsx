import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { paths } from "@/routes/paths";
import { DrawerItem } from "@/types";


export const drawerItems: DrawerItem[] = [
    {
        label: "Home",
        path: paths.home(),
        icon: <HomeIcon/>
    },
    {
        label: "Profile",
        path: paths.profile(),
        icon: <PersonIcon/>
    },
];

