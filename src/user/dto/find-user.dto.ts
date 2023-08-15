import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class FindUserDTO {
  @ApiResponseProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  hash: string;

  @ApiProperty()
  hashedRt: string | null;

  @ApiProperty({
    description: "Le prénom d'un utilisateur",
    minLength: 2,
    default: '',
  })
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  role: Role;
}

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
