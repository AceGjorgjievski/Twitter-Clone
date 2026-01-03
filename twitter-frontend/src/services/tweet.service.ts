import { BACKEND_API } from "../../config-global";
import axiosInstance from "@/utils/axios";

const API_URL = `${BACKEND_API}/tweet`;

export async function createTweet(formData: FormData) {
  const res = await axiosInstance.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return (await res).data;
}

export async function loadTweets(limit = 5, cursor?: string) {
  const res = await axiosInstance.get(API_URL, {
    params: { limit, cursor },
  });

  return res.data;
}

export async function likeTweet(tweetId: number, userId: number) {
  const res = await axiosInstance.post(`${API_URL}/${tweetId}/like`, {
    userId,
  });

  return res.data;
}
