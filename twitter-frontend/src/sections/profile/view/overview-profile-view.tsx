"use client";

import { useAuthContext } from "@/auth/hooks";

import { useEffect, useMemo, useRef, useState } from "react";
import { PaginatedTweet, PROFILE_TABS, User, UserProfileDto } from "@/types";
import { loadUserInfo } from "@/services";
import { useInfiniteTweets } from "@/hooks";

import {
  FollowersView,
  FollowingView,
  LikedTweetsView,
  ProfileHeaderView,
  ProfileSubView,
} from "@/shared/components/profile";
import { slugify } from "@/utils/helpers";
import { Box, Typography } from "@mui/material";

export default function ProfileView() {
  const { user } = useAuthContext();
  const [userInfo, setUserInfo] = useState<UserProfileDto>();

  const loaderRef = useRef<HTMLDivElement>(null);
  const [currentTab, setCurrentTab] = useState("profile");

  const fetchUserInfo = useMemo(
    () =>
      async (limit: number, cursor?: string): Promise<PaginatedTweet> => {
        const res = await loadUserInfo(
          slugify(user?.name as string),
          limit,
          cursor
        );
        setUserInfo(res);
        return res.tweets;
      },
    [name]
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
  } = useInfiniteTweets(["profile-tweets", user?.id], fetchUserInfo, 5);

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
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Typography>Loading more tweets...</Typography>
      </Box>
    );
  }

  if (status === "error") {
    return <p>Error: {error?.message}</p>;
  }

  return (
    <>
      <ProfileHeaderView
        user={user as User}
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        tabs={PROFILE_TABS}
      />

      {currentTab === "profile" && userInfo && (
        <>
          <ProfileSubView
            user={userInfo?.user as User}
            tweets={userTweets}
            isFetchingNextPage={isFetchingNextPage}
            totalFollowers={Number(userInfo?.totalFollowers.length)}
            totalFollowing={Number(userInfo?.totalFollowing.length)}
            totalLikedTweets={Number(userInfo?.totalLikedTweets?.tweets.length)}
            totalRetweetedTweets={Number(
              userInfo?.totalRetweetedTweets.tweets.length
            )}
          />
          <div ref={loaderRef} style={{ height: 40 }} />
        </>
      )}
      {currentTab === "liked-tweets" && <LikedTweetsView user={user as User} />}
      {currentTab === "followers" && (
        <FollowersView users={userInfo?.totalFollowers as User[]} />
      )}
      {currentTab === "following" && (
        <FollowingView users={userInfo?.totalFollowing as User[]} />
      )}
    </>
  );
}
