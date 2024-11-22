import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    testId: string;
}
