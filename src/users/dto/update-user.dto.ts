import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { UserType } from '../entites/users.entity';

export class UpdateUserDto {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(UserType)
  type: UserType;

  @IsOptional()
  @IsMongoId()
  grocery: string;
}