import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    create(@Body() dto: CreateQuestionDto) {
        return this.questionService.create(dto);
    }

    @Get(':id')
    findAllByTest(@Param('id') id: string) {
        return this.questionService.findAll(id);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.questionService.delete(id);
    }
}
