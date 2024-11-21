import { IsEmail, IsString, MinLength, Validate } from 'class-validator';
import { IsPasswordMatchingConstraintDecorator } from '@common/decorators';

export class RegisterDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  password: string;
  @IsString()
  @MinLength(6)
  @Validate(IsPasswordMatchingConstraintDecorator)
  passwordRepeat: string;
}
