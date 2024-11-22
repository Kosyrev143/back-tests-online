import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTestDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    categoryId: string;
}
