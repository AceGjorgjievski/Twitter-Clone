import { BACKEND_API } from "../../config-global";
import axiosInstance from "@/utils/axios";

const API_URL = `${BACKEND_API}/tweet`;

export default async function createTweet(formData: FormData) {
  const res = await axiosInstance.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return (await res).data;
}
