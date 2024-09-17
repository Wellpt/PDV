import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  password: string;
  username: string;
  email: string;  
}
