import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  UsePipes,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserLoginDto } from 'models/dtos/user-login.dto';
import { UserRegisterDto } from 'models/dtos/user-register.dto';
import { CurrentUserDecorator } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { ZodValidationPipe } from 'models/pipes/zod-validation.pipe';
import { UserRegistrationSchema } from 'models/dtos/zod/user-register-zod.dto';
import { UserLoginSchema } from 'models/dtos/zod/user-login-zod.dto';
import { User } from '.prisma/client';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UsePipes(new ZodValidationPipe(UserRegistrationSchema))
  @Post('register')
  register(@Body() body: UserRegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @UsePipes(new ZodValidationPipe(UserLoginSchema))
  @Post('login')
  login(@Body() body: UserLoginDto) {
    return this.authService.login(body);
  }

  @Get('current')
  @UseGuards(AuthGuard('jwt'))
  getCurrent(@CurrentUserDecorator() user: any) {
    const fullUser = this.authService.findUserByUserId(user.userId);
    return fullUser;
  }

  @Get(':id/user-profile')
  getUserProfile(
    @Param('id') username: string,
  ): Promise<Omit<User, 'password'>> {
    return this.authService.getUserProfileInfo(username);
  }
}
