import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from '../question/dto';
import { PrismaService } from '@prisma/prisma.service';
import { CreateAnswerDto } from './dto';

@Injectable()
export class AnswerService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(dto: CreateAnswerDto) {
        const avlQuestion = await this.prismaService.question.findFirst({ where: { id: dto.questionId } });
        if (!avlQuestion) {
            throw new NotFoundException();
        }

        const _answer = await this.prismaService.answer.findFirst({
            where: { content: dto.content, questionId: dto.questionId },
        });
        if (_answer) {
            throw new ConflictException();
        }

        const existingCorrectAnswer = await this.prismaService.answer.findFirst({
            where: { isCorrect: true, questionId: dto.questionId },
        });
        if (existingCorrectAnswer && dto.isCorrect == true) {
            throw new ConflictException('У этого вопроса уже есть правильный ответ.');
        }

        const answer = await this.prismaService.answer.create({
            data: {
                ...dto,
            },
            include: {
                question: {
                    include: {
                        test: true,
                    },
                },
            },
        });
        return answer;
    }

    async findAll(id: string) {
        const question = await this.prismaService.question.findUnique({ where: { id } });
        if (!question) {
            throw new NotFoundException();
        }

        return this.prismaService.answer.findMany({
            where: { questionId: id },
        });
    }

    async delete(id: string) {
        const answer = await this.prismaService.answer.findUnique({ where: { id } });
        if (!answer) {
            throw new NotFoundException();
        }

        return this.prismaService.answer.delete({ where: { id }, select: { id: true } });
    }
}
