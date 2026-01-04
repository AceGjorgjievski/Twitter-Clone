"use client";

import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

import Tabs, { tabsClasses } from "@mui/material/Tabs";
import { Card, Tab } from "@mui/material";

import ProfileCover from "../profile-cover";

import ProfileSubView from "../profile-view";
import LikedTweetsView from "../liked-tweets-view";
import FollowersView from "../followers-view";
import FollowingView from "../following-view";

import { useAuthContext } from "@/auth/hooks";
import { useSidebarContext } from "@/components/context";

import { useCallback, useEffect, useRef, useState } from "react";
import { User } from "@/types";
import { loadTweetsForCurrentUser } from "@/services";
import { useInfiniteTweets } from "@/hooks";

const TABS = [
  {
    value: "profile",
    label: "Profile",
    icon: <AccountCircleIcon />,
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

export default function ProfileView() {
  const { user } = useAuthContext();
  const { isCollapsed } = useSidebarContext();

  const [currentTab, setCurrentTab] = useState("profile");
  const loaderRef = useRef<HTMLDivElement>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
  } = useInfiniteTweets(
    ["profile-tweets", user?.id],
    loadTweetsForCurrentUser,
    5
  );

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    []
  );

  const userTweets = data?.pages.flatMap((page) => page.tweets) || [];

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;

    const currentLoader = loaderRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !isFetching &&
          !isFetchingNextPage &&
          hasNextPage
        ) {
          fetchNextPage();
        }
      },
      { rootMargin: "150px" }
    );

    observer.observe(currentLoader);
    return () => observer.unobserve(currentLoader);
  }, [hasNextPage, isFetching, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <p>Loading initial tweets...</p>;
  }

  if (status === "error") {
    return <p>Error: {error?.message}</p>;
  }

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
          role={user?.role as string}
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
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </Tabs>
      </Card>

      {currentTab === "profile" && (
        <ProfileSubView user={user as User} tweets={userTweets} />
      )}
      {currentTab === "liked-tweets" && <LikedTweetsView user={user as User}/>}
      {currentTab === "followers" && <FollowersView />}
      {currentTab === "following" && <FollowingView />}
    </>
  );
}
