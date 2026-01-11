import { Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUserDecorator } from 'auth/decorators/current-user.decorator';
import { Public } from 'auth/decorators/public.decorator';
import { User } from '.prisma/client';

@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post(':id/follow')
  async followUser(
    @Param('id') targetUserId: string,
    @CurrentUserDecorator() user: any,
  ): Promise<{ followed: boolean }> {
    return this.userService.followUser(Number(user.id), Number(targetUserId));
  }

  @Post(':id/unfollow')
  async unfollowUser(
    @Param('id') targetUserId: string,
    @CurrentUserDecorator() user: any,
  ): Promise<{ followed: boolean }> {
    return this.userService.unfollowUser(Number(user.id), Number(targetUserId));
  }

  @Get(':id/is-following')
  async isFollowing(
    @Param('id') targetUserId: string,
    @CurrentUserDecorator() user: any,
  ): Promise<{ isFollowing: boolean }> {
    return this.userService.isFollowing(Number(user.id), Number(targetUserId));
  }

  @Public()
  @Get(':id/total-followers')
  async getTotalFollowers(
    @Param('id') targerUserId: string,
  ): Promise<Omit<User, 'password'>[]> {
    return this.userService.findAllFollowersUsers(Number(targerUserId));
  }

  @Public()
  @Get(':id/total-following')
  async getTotalFollowing(
    @Param('id') targetUserId: string,
  ): Promise<Omit<User, 'password'>[]> {
    return this.userService.findAllFollowingsUsers(Number(targetUserId));
  }
}
