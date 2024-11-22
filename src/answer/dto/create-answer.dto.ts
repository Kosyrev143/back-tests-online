import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsBoolean()
    isCorrect: boolean;

    @IsNotEmpty()
    @IsString()
    questionId: string;
}
