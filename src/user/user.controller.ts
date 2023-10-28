import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { GetCurrentUserId } from 'src/common/decorators/user';
import { UserDTO } from './dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('informations')
  @ApiOperation({
    summary: "Récupérer les informations de l'utilisateur",
    description: "Récupération des informations de l'utilisateur pour le profil",
  })
  @ApiResponse({ status: 200, type: UserDTO, description: 'Opération réussie' })
  getUser(@GetCurrentUserId() userId: number): Promise<UserDTO> {
    return this.userService.getUserInformations(userId);
  }
}
