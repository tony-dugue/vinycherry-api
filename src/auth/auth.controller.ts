import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './models';
import { Tokens } from './types';
import { AtGuard, RtGuard } from 'src/common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() user: RegisterUserDto): Promise<Tokens> {
    console.log(user);
    return this.authService.registerUser(user);
  }

  @Public()
  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: LoginUserDto) {
    return this.authService.validateUser(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    console.log(userId);
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
