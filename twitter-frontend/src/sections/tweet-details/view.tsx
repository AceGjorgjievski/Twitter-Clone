"use client";

import { loadTweet } from "@/services";
import { TweetItem } from "@/shared/components";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

type Params = {
  tweetId: number;
};

export default function TweetDetailsView({ tweetId }: Params) {
  const { data: tweet, isLoading, error } = useQuery({
    queryKey: ["tweet", tweetId],
    queryFn: () => loadTweet(tweetId),
  });

  if (isLoading) return <>Loading....</>;

  if (error || !tweet) return notFound();

  return tweet && <TweetItem tweet={tweet} />;
}
