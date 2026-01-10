import { PaginatedTweet } from "./paginated-tweet-dto.type";
import { User } from "./user-dto.type";

export type UserProfileDto = {
  user: User;
  tweets: PaginatedTweet;
};
