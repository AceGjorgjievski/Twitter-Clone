import { Tweet } from "./tweet-dto.type";

export type PaginatedTweet = {
  tweets: Tweet[];
  nextCursor: string | null;
};
