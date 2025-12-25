import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from 'models/user-login.dto';
import { UserRegisterDto } from 'models/user-register.dto';
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
  ): Promise<Omit<User, 'password'> & { token: string }> {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await this.databaseService.user.create({
      data: {
        name: body.name,
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
      token,
    };
  }

  async login(
    body: UserLoginDto,
  ): Promise<Omit<User, 'password'> & { token: string }> {
    const user = await this.databaseService.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(body.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      token,
    };
  }
}
