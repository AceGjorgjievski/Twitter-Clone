import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Malformed token');
    }

    try {
      // Verify JWT token
      const decoded = this.jwtService.verify(token);
      request.user = {
        id: decoded.sub,
        email: decoded.email,
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Unauthorized access');
    }
  }
}
