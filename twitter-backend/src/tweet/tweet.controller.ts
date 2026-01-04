import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from 'models/create-tweet.dto';
import { CurrentUserDecorator } from 'auth/decorators/current-user.decorator';
import { Tweet } from '.prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { Public } from 'auth/decorators/public.decorator';
import { PaginatedTweet } from 'models/paginated-tweet.dto';

@Controller('api/tweet')
export class TweetController {
  constructor(private readonly tweeterService: TweetService) {}

  @Public()
  @Get()
  async getAllTweets(
    @Query('limit') limit = 5,
    @Query('cursor') cursor?: string,
  ): Promise<PaginatedTweet> {
    return this.tweeterService.findAllPaginated({
      limit: Number(limit),
      cursor,
    });
  }

  @Get('currentUser')
  async getAllTweetForCurrentUser(
    @CurrentUserDecorator() user: any,
    @Query('limit') limit = 5,
    @Query('cursor') cursor?: string,
  ): Promise<PaginatedTweet> {
    return this.tweeterService.findAllForCurrentUser(user.id);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateTweetDto,
    @CurrentUserDecorator() user: any,
  ): Promise<Tweet> {
    const imageUrls = files.map((file) => `/uploads/${file.filename}`);

    return this.tweeterService.create(
      {
        description: dto.description,
        images: imageUrls,
      },
      user.id,
    );
  }

  @Post(':id/like')
  async likeTweet(
    @Param('id') tweetId: string,
    @Body() body: { userId: number },
  ): Promise<{
    liked: boolean;
    totalLikes: number;
  }> {
    return this.tweeterService.likeTweet(Number(tweetId), body.userId);
  }

  @Get('liked')
  async getLikedTweets(
    @CurrentUserDecorator() user: any,
    @Query('limit') limit = 5,
    @Query('cursor') cursor?: string,
  ): Promise<PaginatedTweet> {
    return this.tweeterService.findLikedByUser({
      userId: user.id,
      limit: Number(limit),
      cursor,
    });
  }
}
