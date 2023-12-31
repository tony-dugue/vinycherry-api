import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail({}, { message: "Le format email n'est pas respecté!" })
  @IsNotEmpty({ message: 'Un email est obligatoire!' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'la propriété password doit être de type String!' })
  @IsNotEmpty({ message: 'Un mot de passe est obligatoire!' })
  password: string;

  @ApiProperty()
  @IsString({ message: 'la propriété confirmationPassword doit être de type String!' })
  @IsNotEmpty({ message: 'Un mot de passe de confirmation est obligatoire!' })
  confirmationPassword: string;

  @ApiProperty()
  @IsString({ message: 'la propriété firstName doit être de type String!' })
  @IsNotEmpty({ message: 'Un prénom est obligatoire!' })
  firstName: string;

  @ApiProperty()
  @IsString({ message: 'la propriété lastName doit être de type String!' })
  @IsNotEmpty({ message: 'Un nom est obligatoire!' })
  lastName: string;
}
