import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class registerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
