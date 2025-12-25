import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserLoginDto } from 'models/user-login.dto';
import { UserRegisterDto } from 'models/user-register.dto';
import { CurrentUserDecorator } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() body: UserRegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  login(@Body() body: UserLoginDto) {
    return this.authService.login(body);
  }

  @Get('current')
  @UseGuards(AuthGuard('jwt'))
  getCurrent(@CurrentUserDecorator() user: any) {
    return user;
  }
}
