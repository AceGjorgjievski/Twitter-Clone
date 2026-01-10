"use client";

import { useInfiniteTweets } from "@/hooks";
import { loadTweetsForUser } from "@/services";
import { OTHER_USER_TABS, PaginatedTweet, User } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";

import ProfileHeaderView from "@/shared/components/profile/profile-header-view";
import ProfileSubView from "@/shared/components/profile/profile-sub-view";
import FollowersView from "@/shared/components/profile/followers-view";
import FollowingView from "@/shared/components/profile/following-view";

type Props = {
  name: string;
};

export default function UserProfileView({ name }: Props) {
  const [user, setUser] = useState<User>();
  const [currentTab, setCurrentTab] = useState("profile");
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchUserTweets = useMemo(
    () =>
      async (limit: number, cursor?: string): Promise<PaginatedTweet> => {
        const res = await loadTweetsForUser(name, limit, cursor);

        setUser((prev) => prev ?? res.user);

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
  } = useInfiniteTweets(["user-profile-tweets", name], fetchUserTweets, 5);

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

  if (isLoading) {
    return <p>Loading initial tweets...</p>;
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
        tabs={OTHER_USER_TABS}
      />

      {currentTab === "profile" && (
        <>
          <ProfileSubView
            user={user as User}
            tweets={tweets}
            isFetchingNextPage={isFetchingNextPage}
          />
          <div ref={loaderRef} style={{ height: 40 }} />
        </>
      )}
      {currentTab === "followers" && <FollowersView />}
      {currentTab === "following" && <FollowingView />}
    </>
  );
}
