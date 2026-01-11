import { useQueryClient } from "@tanstack/react-query";

export function useTweetQueries(userId: number) {
  const queryClient = useQueryClient();

  const refreshTweetFeeds = async () => {
    await queryClient.invalidateQueries({ queryKey: ["tweets-feed"] });
    await queryClient.refetchQueries({ queryKey: ["tweets-feed"] });
  };

  const refreshUserQueries = async () => {
    if (!userId) return;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["profile-tweets", userId] }),
      queryClient.invalidateQueries({
        queryKey: ["profile-liked-tweets", userId],
      }),
      queryClient.invalidateQueries({queryKey: ["user-profile-tweets"]}),
      queryClient.invalidateQueries({ queryKey: ["profile-info", userId] })
    ]);
  };

  const refreshAllTweetData = async () => {
    await Promise.all([refreshTweetFeeds(), refreshUserQueries()]);
  };

  const refreshTweet = async (tweetId: number) => {
    await queryClient.invalidateQueries({ queryKey: ["tweet", tweetId] });
    await queryClient.refetchQueries({ queryKey: ["tweet", tweetId] });
  };

  return {
    refreshTweetFeeds,
    refreshUserQueries,
    refreshAllTweetData,
    refreshTweet,
  };
}
