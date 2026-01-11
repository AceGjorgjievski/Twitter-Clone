import { Module } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetController } from './tweet.controller';
import { DatabaseService } from 'database/database.service';
import { AuthModule } from 'auth/auth.module';
import { UsersService } from 'users/users.service';

@Module({
  imports: [AuthModule],
  controllers: [TweetController],
  providers: [TweetService, DatabaseService, UsersService],
})
export class TweetModule {}
