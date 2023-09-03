import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: 'Votre email est obligatoire!' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Votre mot de passe est obligatoire!' })
  password: string;
}
