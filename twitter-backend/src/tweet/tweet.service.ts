import { Prisma, Tweet } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'database/database.service';
import { CreateTweetDto } from 'models/create-tweet.dto';

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
