import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TweetModule } from './tweet/tweet.module';
import { AuthModule } from 'auth/auth.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuardService } from 'auth/guard/auth-guard.service';
import { UsersModule } from 'users/users.module';

@Module({
  imports: [DatabaseModule, TweetModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    Reflector,
    {
      provide: APP_GUARD,
      useClass: AuthGuardService,
    },
  ],
})
export class AppModule {}
