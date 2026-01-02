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
}
