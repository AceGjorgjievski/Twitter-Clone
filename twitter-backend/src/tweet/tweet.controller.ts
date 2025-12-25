import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { Prisma, User } from '.prisma/client';
import { Public } from 'auth/decorators/public.decorator';
import { CurrentUserDecorator } from 'auth/decorators/current-user.decorator';
import { CreateTweetDto } from 'models/create-tweet.dto';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Post()
  create(
    @Body() createTweetDto: CreateTweetDto,
    @CurrentUserDecorator() user: User,
  ) {
    return this.tweetService.create(createTweetDto, user.id);
  }

  @Public()
  @Get()
  findAll() {
    return this.tweetService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tweetService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTweetDto: Prisma.TweetUpdateInput,
  ) {
    return this.tweetService.update(+id, updateTweetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tweetService.remove(+id);
  }
}
