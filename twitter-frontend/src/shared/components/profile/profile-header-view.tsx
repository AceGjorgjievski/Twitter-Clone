import Tabs, { tabsClasses } from "@mui/material/Tabs";
import { Card, Tab } from "@mui/material";

import { ProfileTab, User } from "@/types";
import ProfileCover from "./profile-cover";

import { useCallback } from "react";
import { useSidebarContext } from "@/components/context";

type Props = {
  user: User;
  currentTab: string;
  onChangeTab: (tab: string) => void;
  tabs: ProfileTab[];
};

export default function ProfileHeaderView({
  user,
  currentTab,
  onChangeTab,
  tabs,
}: Props) {
  const { isCollapsed } = useSidebarContext();

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      onChangeTab(newValue);
    },
    []
  );

  return (
    <>
      <Card
        sx={{
          mb: 1,
          height: 200,
          position: "relative",
          borderRadius: 8,
        }}
      >
        <ProfileCover
          slug={user?.slug as string}
          profilePicture={user?.profilePicture as string}
          name={user?.name as string}
        />

        <Tabs
          key={isCollapsed ? "collapsed" : "expanded"}
          value={currentTab}
          onChange={handleChangeTab}
          TabIndicatorProps={{
            sx: {
              height: 3,
              borderRadius: 2,
              bgcolor: "primary.main",
              transition: "none",
            },
          }}
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "background.paper",
            [`& .${tabsClasses.flexContainer}`]: {
              justifyContent: "flex-end",
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </Tabs>
      </Card>
    </>
  );
}
