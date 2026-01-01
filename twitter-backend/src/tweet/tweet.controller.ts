import {
  Body,
  Controller,
  Get,
  Post,
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

@Controller('api/tweet')
export class TweetController {
  constructor(private readonly tweeterService: TweetService) {}

  @Get()
  async getAllTweets(): Promise<Tweet[]> {
    return this.tweeterService.findAll();
  }

  @Get('currentUser')
  async getAllTweetForCurrentUser(
    @CurrentUserDecorator() user: any,
  ): Promise<Tweet[]> {
    return this.tweeterService.findAllForCurrentUser(user.id);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 3, {
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
}
