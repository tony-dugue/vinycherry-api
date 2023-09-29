import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators/user';
import { RtGuard } from 'src/common/guards';

import { LoginUserDto, RegisterUserDto } from './models';
import { Tokens } from './types';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/auth';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/register')
  @ApiOperation({
    summary: "Inscrire un utilisateur",
    description: "Inscrire un utilisateur",
  })
  @HttpCode(HttpStatus.CREATED)
  register(@Body() user: RegisterUserDto): Promise<Tokens> {
    return this.authService.registerUser(user);
  }

  @Public()
  @Post('local/login')
  @ApiOperation({
    summary: "Connecter un utilisateur",
    description: "Connecter un utilisateur",
  })
  @HttpCode(HttpStatus.OK)
  login(@Body() user: LoginUserDto) {
    return this.authService.validateUser(user);
  }

  @Post('logout')
  @ApiOperation({
    summary: "Déconnecter un utilisateur",
    description: "Déconnecter un utilisateur",
  })
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiOperation({
    summary: "Vérifier le refresh token",
    description: "Vérifier le refresh token",
  })
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
