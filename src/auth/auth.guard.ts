import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ITokenUser } from '../models';
import { ActivityLog } from 'src/entities';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access denied. No token provided.');
    }

    // Get token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    try {
      // Verify the token
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
        ignoreExpiration: false,
      });

      // Attach user to request
      request.user = decodedToken as ITokenUser;
      let log = request['log'] as ActivityLog ?? null;
      // If you have activity logging
      if (log) {
        log.addUserDetails(request.user);
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized Request');
    }
  }
}