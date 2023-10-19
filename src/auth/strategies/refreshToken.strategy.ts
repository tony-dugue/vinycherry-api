import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: 'rt-secret',
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
    });
  }

  async validate(req: RequestType, payload: any) {
    if (!payload) {
      throw new BadRequestException('invalid jwt token');
    }
    const refreshToken = req.cookies.refresh;
    return { ...payload, refreshToken };
  }

  private static extractJWT(req: RequestType): string | null {
    if (req.cookies && 'refresh_token' in req.cookies) {
      return req.cookies.refresh_token;
    }
    return null;
  }
}
