import { Prisma, Tweet, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'database/database.service';
import { CreateTweetDto } from 'models/dtos/create-tweet.dto';
import { PaginatedTweet } from 'models/dtos/paginated-tweet.dto';

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

  async findAllPaginated(
    {
      limit,
      cursor,
    }: {
      limit: number;
      cursor?: string;
    },
    userId?: number,
  ): Promise<PaginatedTweet> {
    const cursorId = cursor ? parseInt(cursor, 10) : undefined;

    const tweets = await this.databaseService.tweet.findMany({
      take: limit + 1,
      where: cursorId ? { id: { lt: cursorId } } : undefined,
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
        _count: {
          select: {
            retweets: true,
          },
        },
        retweetOf: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                profilePicture: true,
              },
            },
            _count: {
              select: {
                retweets: true,
              },
            },
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

    if (!userId) {
      const normalizedTweets = tweets.map(({ _count, ...tweet }) => ({
        ...tweet,
        retweetCount: _count.retweets,
        isRetweeted: false,
      }));
      return {
        tweets: normalizedTweets,
        nextCursor,
      };
    }

    const tweetIds = tweets.map((t) => t.id);

    const userRetweets = await this.databaseService.tweet.findMany({
      where: {
        authorId: userId,
        retweetOfId: { in: tweetIds },
      },
      select: {
        retweetOfId: true,
      },
    });

    const retweetedTweetIds = new Set(userRetweets.map((r) => r.retweetOfId));

    const normalizedTweets = tweets.map(({ _count, retweetOf, ...tweet }) => ({
      ...tweet,
      retweetCount: _count.retweets,
      retweetOf: retweetOf
        ? {
            ...retweetOf,
            retweetCount: retweetOf._count.retweets,
          }
        : null,
      isRetweeted:
        retweetedTweetIds.has(tweet.id) ||
        (tweet.retweetOfId !== null &&
          retweetedTweetIds.has(tweet.retweetOfId)),
    }));

    return {
      tweets: normalizedTweets,
      nextCursor,
    };
  }

  async findAllForCurrentUser(
    userId: number,
    limit: number = 5,
    cursor?: string,
  ): Promise<PaginatedTweet> {
    const cursorId = cursor ? parseInt(cursor, 10) : undefined;

    const tweets = await this.databaseService.tweet.findMany({
      take: limit + 1,
      where: {
        author: { id: userId },
        ...(cursorId && { id: { lt: cursorId } }),
      },
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
        retweetOf: {
          select: {
            id: true,
            description: true,
            images: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                profilePicture: true,
              },
            },
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

  async findOne(id: number) {
    return this.databaseService.tweet.findUnique({
      where: {
        id,
      },
    });
  }

  async getAllTweetsForUser(
    user: Omit<User, 'password'>,
    limit: number = 5,
    cursor?: string,
  ) {
    return this.findAllForCurrentUser(user.id, limit, cursor);
  }

  async update(id: number, updateTweetDto: Prisma.TweetUpdateInput) {
    return this.databaseService.tweet.update({
      where: {
        id: id,
      },
      data: updateTweetDto,
    });
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    try {
      await this.databaseService.tweet.delete({
        where: {
          id: id,
        },
      });
      return { deleted: true };
    } catch {
      return { deleted: false };
    }
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

  async findLikedByUser({
    userId,
    limit,
    cursor,
  }: {
    userId: number;
    limit: number;
    cursor?: string;
  }): Promise<PaginatedTweet> {
    const cursorId = cursor ? Number(cursor) : undefined;

    const tweets = await this.databaseService.tweet.findMany({
      take: limit + 1,
      where: {
        likedBy: {
          some: { id: userId },
        },
        ...(cursorId && { id: { lt: cursorId } }),
      },
      orderBy: { id: 'desc' },
      include: {
        author: true,
        likedBy: true,
      },
    });

    let nextCursor: string | null = null;
    if (tweets.length > limit) {
      nextCursor = tweets[limit - 1].id.toString();
      tweets.splice(limit);
    }

    return { tweets, nextCursor };
  }

  async findById(tweetId: number): Promise<Tweet> {
    return this.databaseService.tweet.findFirst({
      where: {
        id: tweetId,
      },
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
        retweetOf: {
          select: {
            id: true,
            description: true,
            images: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async retweetTweet(
    tweetId: number,
    userId: number,
    description?: string,
    images: string[] = [],
  ): Promise<{ retweeted: boolean; tweet?: Tweet }> {
    return this.databaseService.$transaction(async (prisma) => {
      const tweet = await prisma.tweet.findUnique({
        where: { id: tweetId },
        select: { id: true, retweetOfId: true, retweetCount: true },
      });

      if (!tweet) throw new Error('Tweet not found');

      const originalTweetId = tweet.retweetOfId ?? tweet.id;

      const existing = await prisma.tweet.findFirst({
        where: {
          authorId: userId,
          retweetOfId: originalTweetId,
        },
      });

      if (existing) {
        await this.databaseService.tweet.delete({
          where: { id: existing.id },
        });

        const respond = await prisma.tweet.update({
          where: { id: originalTweetId },
          data: {
            retweetCount: {
              decrement: 1,
            },
          },
        });

        return { retweeted: false, tweet: respond };
      }

      await prisma.tweet.update({
        where: { id: originalTweetId },
        data: {
          retweetCount: {
            increment: 1,
          },
        },
      });

      const newRetweet = await prisma.tweet.create({
        data: {
          description: description || null,
          images,
          author: { connect: { id: userId } },
          retweetOf: { connect: { id: originalTweetId } },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
            },
          },
          retweetOf: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  profilePicture: true,
                },
              },
            },
          },
          likedBy: true,
        },
      });

      return {
        retweeted: true,
        tweet: newRetweet,
      };
    });
  }

  async edit(
    tweetId: number,
    description?: string,
    imageUrls: string[] = [],
  ): Promise<{ updated: boolean; tweet: Tweet | null }> {
    return this.databaseService.$transaction(async (prisma) => {
      const foundTweet = await prisma.tweet.findFirst({
        where: {
          id: tweetId,
        },
      });

      if (!foundTweet) return { updated: false, tweet: null };

      const updatedTweet = await prisma.tweet.update({
        where: {
          id: tweetId,
        },
        data: {
          description: description,
          images: imageUrls,
        },
      });

      return { updated: true, tweet: updatedTweet };
    });
  }
}
