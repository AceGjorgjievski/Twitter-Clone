import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';

import { paths } from "@/routes/paths";
import { DrawerItem } from "@/types";


export const drawerItems: DrawerItem[] = [
    {
        label: "Home",
        path: paths.home(),
        icon: <HomeIcon/>
    },
    {
        label: "Notifications",
        path: paths.notifications(),
        icon: <NotificationsIcon/>
    },
    {
        label: "Messages",
        path: paths.messages(),
        icon: <MailIcon/>
    },
    {
        label: "Profile",
        path: paths.profile(),
        icon: <PersonIcon/>
    }
];

