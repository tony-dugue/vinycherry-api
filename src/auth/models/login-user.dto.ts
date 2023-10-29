import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Role } from 'src/user/enum/role.enum';

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: 'Votre email est obligatoire!' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Votre mot de passe est obligatoire!' })
  password: string;
}
