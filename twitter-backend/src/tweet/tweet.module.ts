import { Module } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetController } from './tweet.controller';
import { DatabaseService } from 'database/database.service';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TweetController],
  providers: [TweetService, DatabaseService],
})
export class TweetModule {}
