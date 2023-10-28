import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  imports: [JwtModule],
  providers: [UserService, AuthService]
})
export class UserModule {}
