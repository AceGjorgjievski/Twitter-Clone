import { Comment } from "./comment-dto.type";
import { User } from "./user-dto.type";

export type Tweet = {
    id: number;
    description: string;
    images: string[];
    totalLikes: number;
    retweetOfId?: number;
    createdAt: Date;
    author: User;

    comments?: Comment[];
    likedBy?: User[];
    retweetOf?: Tweet;
    retweetCount: number;
    isRetweeted: boolean;
}
