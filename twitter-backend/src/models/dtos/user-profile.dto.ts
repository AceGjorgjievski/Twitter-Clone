import { PaginatedTweet } from 'models/dtos/paginated-tweet.dto';

export type UserProfileDto = {
  user: {
    id: number;
    name: string;
    slug: string;
    email: string;
    profilePicture?: string;
    createdAt: Date;
    role: string;
  };
  tweets: PaginatedTweet;
};
