import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto';

@Controller('answer')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @Post()
    create(@Body() dto: CreateAnswerDto) {
        return this.answerService.create(dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.answerService.delete(id);
    }
}
