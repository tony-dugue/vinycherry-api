import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UserDTO } from './dto';
import { AuthService } from 'src/auth/auth.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TokensDto } from 'src/auth/models';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createUser(user: CreateUserDto): Promise<TokensDto> {
    const existingUser = await this.prisma.user.findUnique({ where: { email: user.email } });
    if (existingUser) throw new ConflictException('Cet email est déjà utilisé');

    if (!user.firstName) throw new ConflictException('Veuillez saisir un prénom');
    if (!user.lastName) throw new ConflictException('Veuillez saisir un nom');

    if (user.password !== user.confirmationPassword) {
      throw new ConflictException(
        'le mot de passe et le mot de passe de confirmation doivent être identique!',
      );
    }
    // hachage du mot de passe
    const password = await this.authService.hashData(user.password);

    const { email, firstName, lastName } = user;

    // enregistrement du user en base de données
    try {
      const newUser = await this.prisma.user.create({
        data: { email, firstName, lastName, password },
      });

      // génération de 2 nouveaux tokens
      const tokens = await this.authService.getTokens(newUser.id, newUser.email, newUser.role);
      await this.authService.updateRefreshTokenHash(newUser.id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Un utilisateur possède déjà cet email!');
        }
      }
      throw error;
    }
  }

  async getUserInformations(userId: number): Promise<UserDTO> {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) throw new ConflictException("L'utilisateur n'existe pas!");
    delete user.password;
    delete user.refreshTokenHash;
    return user;
  }
}
