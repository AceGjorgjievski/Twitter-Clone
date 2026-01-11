import { BACKEND_API } from "../../config-global";
import axiosInstance from "@/utils/axios";

export const API_URL = `${BACKEND_API}/users`;

export async function followUser(
  targetUserId: number
): Promise<{ followed: boolean }> {
  const res = await axiosInstance.post<{ followed: boolean }>(
    `${API_URL}/${targetUserId}/follow`
  );

  return res.data;
}

export async function unfollowUser(
  targetUserId: number
): Promise<{ followed: boolean }> {
  const res = await axiosInstance.post<{ followed: boolean }>(
    `${API_URL}/${targetUserId}/unfollow`
  );

  return res.data;
}

export async function isFollowing(
  targetUserId: number
): Promise<{ isFollowing: boolean }> {
  const res = await axiosInstance.get<{ isFollowing: boolean }>(
    `${API_URL}/${targetUserId}/is-following`
  );

  return res.data;
}
