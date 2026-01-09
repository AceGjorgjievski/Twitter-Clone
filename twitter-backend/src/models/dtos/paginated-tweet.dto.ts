import { Tweet } from '.prisma/client';

export type PaginatedTweet = {
  tweets: Tweet[];
  nextCursor: string | null;
};
