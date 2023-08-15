import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindUserDTO } from './dto/find-user.dto';
import { BadRequest, InternalError, NotFound, Unauthorized } from 'src/common/decorators/error';
import { GetCurrentUserId } from 'src/common/decorators/user';

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
  @ApiResponse({ status: 200, type: FindUserDTO, description: 'Opération réussie' })
  @InternalError('Internal Server Error', "Une erreur interne s'est produite")
  @BadRequest('Bad Request', "La demande n'est pas valide")
  @NotFound('Not found', "La ressource demandée n'existe pas")
  @Unauthorized('Unauthorized', 'Accès refusé')
  getUser(@GetCurrentUserId() userId: number) {
    return this.userService.getUserInformations(userId);
  }
}
