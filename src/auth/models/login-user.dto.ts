import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Votre email est obligatoire!' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Votre mot de passe est obligatoire!' })
  password: string;
}