"use client";

import { loadTweet } from "@/services";
import { TweetItem } from "@/shared/components";
import { Tweet } from "@/types";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

type Params = {
  tweetId: number;
};

export default function TweetDetailsView({ tweetId }: Params) {
  const [tweet, setTweet] = useState<Tweet>();
  const [loading, setLoading] = useState<boolean>(false);
  const [notFoundTweet, setNotFoundTweet] = useState<boolean>(false);

  useEffect(() => {
    const fetchTweet = async () => {
      setLoading(true);
      try {
        const res = await loadTweet(tweetId);
        if (!res) {
          setNotFoundTweet(true);
        } else {
          setTweet(res);
        }
      } catch (err) {
        setNotFoundTweet(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTweet();
  }, [tweetId]);

  if (loading) return <>Loading....</>;

  if (notFoundTweet) return notFound();

  return tweet && <TweetItem tweet={tweet} />;
}
