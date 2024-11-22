import { Body, Controller, Delete, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto';
import { CurrentUser } from '@common/decorators';
import { JwtPayloadInterface } from '@auth/interfaces';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    create(@Body() dto: CreateQuestionDto, @CurrentUser() user: JwtPayloadInterface) {
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.questionService.create(dto, user);
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
