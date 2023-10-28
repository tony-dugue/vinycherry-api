import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokensDto, LoginUserDto } from './models';
import * as argon from 'argon2';
import { Response as ResponseType } from 'express';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(user: LoginUserDto): Promise<TokensDto> {
    // récupération du user dans la base de données
    const foundUser = await this.prisma.user.findUnique({ where: { email: user.email } });
    if (!foundUser) throw new UnauthorizedException('Accès refusé!');

    // comparaison des mots de passe
    const pwMatches = await argon.verify(foundUser.password, user.password);
    if (!pwMatches) throw new UnauthorizedException('Accès refusé!');

    // génération de 2 nouveaux tokens
    const tokens = await this.getTokens(foundUser.id, foundUser.email, foundUser.role);
    await this.updateRefreshTokenHash(foundUser.id, tokens.refresh_token);

    return tokens;
  }

  async logoutUser(userId: number) {
    await this.prisma.user.updateMany({
      where: { id: userId, refreshTokenHash: { not: null } },
      data: { refreshTokenHash: null },
    });
  }

  async refreshTokens(userId: number, rt: string): Promise<TokensDto> {
    // récupération du user dans la base de données
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Accès refusé!');

    // comparaison des hash du refresh token
    const rtMatches = await argon.verify(user.refreshTokenHash, rt);
    if (!rtMatches) throw new UnauthorizedException('Accès refusé!');

    // génération de 2 nouveaux tokens
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  // Database modifier

  async updateRefreshTokenHash(userId: number, rt: string) {
    const hashedRt = await this.hashData(rt);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hashedRt },
    });
  }

  storeTokenInCookie(res: ResponseType, authToken: TokensDto) {
    res.cookie('access_token', authToken.access_token, { maxAge: 1000 * 60 * 1, httpOnly: true });
    res.cookie('refresh_token', authToken.refresh_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  }

  // Helpers

  hashData(data: string) {
    return argon.hash(data);
  }

  async getTokens(userId: number, email: string, role: string): Promise<TokensDto> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: 'at-secret', expiresIn: 60 * 15 }, // 15 minutes
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: 'rt-secret', expiresIn: 60 * 60 * 24 * 7 }, // 1 semaine
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
