import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserInformations(userId: number): Promise<UserDTO> {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) throw new ForbiddenException("L'utilisateur n'existe pas!");
    delete(user.hash)
    delete(user.hashedRt)
    return user;
  }
}
