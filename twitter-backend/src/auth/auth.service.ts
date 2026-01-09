import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from 'models/dtos/user-login.dto';
import { UserRegisterDto } from 'models/dtos/user-register.dto';
import { DatabaseService } from 'database/database.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async register(
    body: UserRegisterDto,
  ): Promise<Omit<User, 'password'> & { accessToken: string }> {
    const existingUser = await this.databaseService.user.findFirst({
      where: {
        OR: [{ email: body.email }, { name: body.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === body.email) {
        throw new ConflictException({
          message: 'Email is already registered',
        });
      }

      if (existingUser.name === body.username) {
        throw new ConflictException({
          message: 'Username is already taken',
        });
      }
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await this.databaseService.user.create({
      data: {
        name: body.username,
        email: body.email,
        password: hashedPassword,
        role: 'user',
      },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      accessToken: token,
    };
  }

  async login(
    body: UserLoginDto,
  ): Promise<Omit<User, 'password'> & { accessToken: string }> {
    const user = await this.databaseService.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new ConflictException({
        message: 'User does not exist (register now) !',
      });
    }

    const valid = await bcrypt.compare(body.password, user.password);
    if (!valid) {
      throw new ConflictException({
        message: 'Incorrect password',
      });
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      accessToken: token,
    };
  }

  async findUserByUserId(userId: number): Promise<Omit<User, 'password'>> {
    return this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profilePicture: true,
        createdAt: true,
      },
    });
  }
}
