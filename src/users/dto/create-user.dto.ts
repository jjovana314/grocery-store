import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, MinLength } from 'class-validator';
import { UserType } from '../entites/users.entity';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(UserType)
  type: UserType;

  @IsMongoId()
  @IsNotEmpty()
  grocery: string;
}