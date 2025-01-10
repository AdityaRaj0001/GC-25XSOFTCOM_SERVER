  import { PassportStrategy } from '@nestjs/passport';
  import { ExtractJwt, Strategy } from 'passport-jwt';
  import { AuthService } from '../auth.service';
  import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';

  export interface JwtPayload {
    id: string;
    role?: string;
    email?: string;
    subscriptionId?: string;
  }

  @Injectable()
  export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
      private readonly authService: AuthService,
      configService: ConfigService,
    ) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.get<string>('JWT_SECRET'),
      });
    }

    async validate(payload: JwtPayload): Promise<any> {
      const user = await this.authService.validateUser(payload);
      if (!user) {
        throw new HttpException('TOKEN_INVALID', HttpStatus.UNAUTHORIZED);
      }
      return user;
    }
  }
