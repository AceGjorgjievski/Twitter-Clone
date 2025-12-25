import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'database/database.service';
import { CreateTweetDto } from 'models/create-tweet.dto';

@Injectable()
export class TweetService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateTweetDto, userId: number) {
    return this.databaseService.tweet.create({
      data: {
        description: dto.description,
        image: dto.image,
        author: {
          connect: { id: userId },
        },
      },
    });
  }

  async findAll() {
    return this.databaseService.tweet.findMany({});
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
