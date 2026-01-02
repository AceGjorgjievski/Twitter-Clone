import { User } from "./user-dto.type";

export type Tweet = {
    id: number;
    description: string;
    images: string[];
    totalLikes: number;
    createdAt: Date;
    author: User;
}
