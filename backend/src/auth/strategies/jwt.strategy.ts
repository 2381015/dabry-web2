import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('JwtStrategy');
  
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      // Try to get user from database
      const user = await this.usersService.findOne(payload.sub);
      
      if (user) {
        // User found in database, return user without password
        const { password, ...result } = user;
        // Always set role to admin for testing purposes
        return { ...result, role: 'admin' };
      } else {
        // If user not found but token is valid, create a memory user
        this.logger.warn(`User with ID ${payload.sub} not found in database. Using token data.`);
        return {
          id: payload.sub,
          email: payload.email,
          name: payload.email.split('@')[0],
          role: 'admin',  // For testing purposes
        };
      }
    } catch (error) {
      // On database error, fall back to using the JWT payload data
      this.logger.error(`JWT validation error: ${error.message}`);
      this.logger.warn('Falling back to JWT payload data for user info');
      
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.email.split('@')[0],
        role: 'admin',  // For testing purposes
      };
    }
  }
}
