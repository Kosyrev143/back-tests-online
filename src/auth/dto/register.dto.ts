import { IsArray, IsEmail, IsOptional, IsString, MinLength, Validate } from 'class-validator';
import { IsPasswordMatchingConstraintDecorator } from '@common/decorators';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';

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
    @IsOptional()
    @IsArray()
    @Type(() => String)
    roles?: Role[];
}
