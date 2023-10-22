import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enum/role.enum';
import { IsEnum } from 'class-validator';

export class UserDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  email: string;

  @ApiProperty({
    description: "Le prénom d'un utilisateur",
    minLength: 2,
    default: '',
  })
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ enum: ['ADMIN', 'USER']})
  @IsEnum(Role)
  role: string;
}
