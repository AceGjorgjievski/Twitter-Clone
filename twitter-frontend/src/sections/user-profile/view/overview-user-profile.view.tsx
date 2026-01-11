"use client";

import { useInfiniteTweets, useTweetQueries } from "@/hooks";
import { followUser, loadUserInfo, unfollowUser } from "@/services";
import { OTHER_USER_TABS, PaginatedTweet, User, UserProfileDto } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";

import ProfileHeaderView from "@/shared/components/profile/profile-header-view";
import ProfileSubView from "@/shared/components/profile/profile-sub-view";
import FollowersView from "@/shared/components/profile/followers-view";
import FollowingView from "@/shared/components/profile/following-view";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useAuthContext } from "@/auth/hooks";
import { usePathname } from "@/routes/hooks";

type Props = {
  name: string;
};

export default function UserProfileView({ name }: Props) {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const isOwnProfile =
    pathname === "/profile" || pathname.includes(`/profile/${user?.slug}`);

  const [userInfo, setUserInfo] = useState<UserProfileDto>();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const loaderRef = useRef<HTMLDivElement>(null);
  const [currentTab, setCurrentTab] = useState("profile");
  const { refreshAllTweetData } = useTweetQueries(Number(userInfo?.user?.id));

  const fetchUserInfo = useMemo(
    () =>
      async (limit: number, cursor?: string): Promise<PaginatedTweet> => {
        const res = await loadUserInfo(name, limit, cursor);
        setUserInfo(res);
        setIsFollowing(res.isFollowing);
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
  } = useInfiniteTweets(["user-profile-tweets", name], fetchUserInfo, 5);

  const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

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

  const handleButtonClick = async () => {
    if (isFollowing) {
      await unfollowUser(Number(userInfo?.user?.id));
    } else {
      await followUser(Number(userInfo?.user?.id));
    }
    setIsFollowing((prev) => !prev);
    await refreshAllTweetData();
  };

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
        user={userInfo?.user as User}
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        tabs={OTHER_USER_TABS}
      />
      {!isOwnProfile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            pr: 3,
          }}
        >
          <Tooltip title={isFollowing ? "UnFollow" : "Follow"}>
            <Button
              variant={isFollowing ? "outlined" : "contained"}
              onClick={handleButtonClick}
            >
              {isFollowing ? "Following ✔️" : "Follow"}
            </Button>
          </Tooltip>
        </Box>
      )}

      {currentTab === "profile" && (
        <>
          <ProfileSubView
            user={userInfo?.user as User}
            tweets={tweets}
            isFetchingNextPage={isFetchingNextPage}
            totalFollowers={Number(userInfo?.totalFollowers?.length)}
            totalFollowing={Number(userInfo?.totalFollowing?.length)}
            totalLikedTweets={Number(userInfo?.totalLikedTweets?.tweets?.length)}
            totalRetweetedTweets={Number(
              userInfo?.totalRetweetedTweets?.tweets?.length
            )}
          />
          <div ref={loaderRef} style={{ height: 40 }} />
        </>
      )}
      {currentTab === "followers" && (
        <FollowersView
          users={userInfo?.totalFollowers as User[]}
          hideButton={true}
        />
      )}
      {currentTab === "following" && (
        <FollowingView
          users={userInfo?.totalFollowing as User[]}
          hideButton={true}
        />
      )}
    </>
  );
}
