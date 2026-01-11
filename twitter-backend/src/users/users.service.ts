import { User } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async followUser(
    currentUserId: number,
    targetUserId: number,
  ): Promise<{ followed: boolean }> {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    await this.databaseService.userFollow.create({
      data: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });

    return { followed: true };
  }

  async unfollowUser(
    currentUserId: number,
    targetUserId: number,
  ): Promise<{ followed: boolean }> {
    await this.databaseService.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    return { followed: false };
  }

  async isFollowing(
    currentUserId: number,
    targetUserId: number,
  ): Promise<{ isFollowing: boolean }> {
    const follows = await this.databaseService.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });
    return { isFollowing: Boolean(follows) };
  }

  async findAllFollowersUsers(
    targetUserId: number,
  ): Promise<Omit<User, 'password'>[]> {
    const followers = await this.databaseService.userFollow.findMany({
      where: {
        followingId: targetUserId,
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            slug: true,
            email: true,
            role: true,
            profilePicture: true,
            createdAt: true,
          },
        },
      },
    });

    return followers.map((f) => f.follower);
  }

  async findAllFollowingsUsers(
    targetUserId: number,
  ): Promise<Omit<User, 'password'>[]> {
    const following = await this.databaseService.userFollow.findMany({
      where: {
        followerId: targetUserId,
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            slug: true,
            email: true,
            role: true,
            profilePicture: true,
            createdAt: true,
          },
        },
      },
    });

    return following.map((f) => f.following);
  }
}
