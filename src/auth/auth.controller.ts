import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response as ResponseType } from 'express';
import { Request as RequestType } from 'express';

import { GetCurrentUserId } from 'src/common/decorators/user';
import { RefreshAuthGuard } from 'src/common/guards';

import { LoginUserDto, RegisterUserDto, TokensDto } from './models';
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
    summary: 'Inscrire un utilisateur',
    description: 'Inscrire un utilisateur',
  })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: RegisterUserDto, @Res({ passthrough: true }) res: ResponseType): Promise<TokensDto> {
    await this.authService.registerUser(user);
    res.status(201).send({ message: "Création de l'utilisateur avec succès" });
    return;
  }

  @Public()
  @Post('local/login')
  @ApiOperation({
    summary: "Connecter un utilisateur à l'application",
    description: "Connecter un utilisateur à l'application",
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: LoginUserDto, @Res({ passthrough: true }) res: ResponseType) {
    const tokens = await this.authService.validateUser(user);
    this.authService.storeTokenInCookie(res, tokens);
    res.status(200).send({ message: 'Authentification avec succès' });
    return;
  }

  @Post('logout')
  @ApiOperation({
    summary: "Déconnecter un utilisateur de l'application",
    description: "Déconnecter un utilisateur de l'application",
  })
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number, @Res({ passthrough: true }) res: ResponseType) {
    await this.authService.logoutUser(userId);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.status(200).send({ message: "Déconnexion de l'application avec succès" });
    return;
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  @ApiOperation({
    summary: 'Vérifier le refresh token',
    description: 'Vérifier le refresh token',
  })
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @Req() req: RequestType, 
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const refreshToken = req.cookies.refresh_token;
    const newAuthToken = await this.authService.refreshTokens(userId, refreshToken);
    this.authService.storeTokenInCookie(res, newAuthToken);
    res.status(200).send({ message: 'Réinitialisation tokens avec succès' });
    return;
  }
}
