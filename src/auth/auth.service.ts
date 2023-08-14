import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Tokens } from './types';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: AuthDto): Promise<Tokens> {
    // hachage du mot de passe
    const hash = await this.hashData(dto.password);

    // enregistrement du user dans la base de données
    try {
      const user = await this.prisma.user.create({
        data: { email: dto.email, hash },
      });

      // génération de 2 nouveaux tokens
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Un utilisateur possède déjà cet email!');
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    // récupération du user dans la base de données
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new ForbiddenException('Accès refusé!');

    // comparaison des mots de passe
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Accès refusé!');

    // génération de 2 nouveaux tokens
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: { id: userId, hashedRt: { not: null }},
      data: { hashedRt: null }
    })
  }

  async refreshTokens(userId: number, rt: string) {
    // récupération du user dans la base de données
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('Accès refusé!');

    // comparaison du hash du refresh token
    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Accès refusé!');

    // génération de 2 nouveaux tokens
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  // Database modifier

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    });
  }

  // Helpers

  hashData(data: string) {
    return argon.hash(data);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: 'at-secret', expiresIn: 60 * 15 }, // 15 minutes
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: 'rt-secret', expiresIn: 60 * 60 * 24 * 7 }, // 1 semaine
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
