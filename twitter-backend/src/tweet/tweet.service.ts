import { Prisma, Tweet } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'database/database.service';
import { CreateTweetDto } from 'models/create-tweet.dto';
import { PaginatedTweet } from 'models/paginated-tweet.dto';

@Injectable()
export class TweetService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateTweetDto, userId: number): Promise<Tweet> {
    return this.databaseService.tweet.create({
      data: {
        description: dto.description,
        images: dto.images || [],
        author: {
          connect: { id: userId },
        },
      },
    });
  }

  async findAll() {
    return this.databaseService.tweet.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findAllPaginated({
    limit,
    cursor,
  }: {
    limit: number;
    cursor?: string;
  }): Promise<PaginatedTweet> {
    const cursorId = cursor ? parseInt(cursor, 10) : undefined;

    const tweets = await this.databaseService.tweet.findMany({
      take: limit + 1,
      where: cursorId
        ? {
            id: { lt: cursorId },
          }
        : undefined,
      orderBy: [{ id: 'desc' }],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
            createdAt: true,
          },
        },
        likedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;

    if (tweets.length > limit) {
      const nextTweet = tweets[limit - 1];
      nextCursor = nextTweet.id.toString();
      tweets.splice(limit);
    }

    return { tweets, nextCursor };
  }

  async findAllForCurrentUser(userId: number): Promise<Tweet[]> {
    return this.databaseService.tweet.findMany({
      where: {
        author: {
          id: userId,
        },
      },
    });
  }

  async findOne(id: number) {
    return this.databaseService.tweet.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateTweetDto: Prisma.TweetUpdateInput) {
    return this.databaseService.tweet.update({
      where: {
        id: id,
      },
      data: updateTweetDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.tweet.delete({
      where: {
        id: id,
      },
    });
  }

  async likeTweet(
    tweetId: number,
    userId: number,
  ): Promise<{
    liked: boolean;
    totalLikes: number;
  }> {
    return this.databaseService.$transaction(async (prisma) => {
      const tweet = await prisma.tweet.findUnique({
        where: { id: tweetId },
        include: {
          likedBy: {
            where: { id: userId },
            select: { id: true },
          },
        },
      });

      if (!tweet) {
        throw new Error('Tweet not found');
      }

      const alreadyLiked = tweet.likedBy.length > 0;

      const updatedTweet = await prisma.tweet.update({
        where: { id: tweetId },
        data: {
          likedBy: alreadyLiked
            ? { disconnect: { id: userId } }
            : { connect: { id: userId } },
          totalLikes: {
            increment: alreadyLiked ? -1 : 1,
          },
        },
        select: {
          totalLikes: true,
        },
      });

      return {
        liked: !alreadyLiked,
        totalLikes: updatedTweet.totalLikes,
      };
    });
  }
}
