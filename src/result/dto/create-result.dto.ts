import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class RecordResultDto {
    @IsString()
    @IsNotEmpty()
    testId: string;

    @IsArray()
    @IsNotEmpty()
    answers: string[]; // Массив идентификаторов выбранных ответов
}
