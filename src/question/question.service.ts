import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestDto } from '../test/dto';
import { JwtPayloadInterface } from '@auth/interfaces';
import { PrismaService } from '@prisma/prisma.service';
import { CreateQuestionDto } from './dto';

@Injectable()
export class QuestionService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(dto: CreateQuestionDto, user: JwtPayloadInterface) {
        const _question = await this.prismaService.question.findFirst({
            where: { content: dto.content, testId: dto.testId },
        });
        if (_question) {
            throw new ConflictException();
        }

        const avlTest = await this.prismaService.test.findFirst({ where: { id: dto.testId } });
        if (!avlTest) {
            throw new NotFoundException();
        }

        if (avlTest.authorId !== user.id) {
            throw new ForbiddenException();
        }

        const question = await this.prismaService.question.create({
            data: {
                ...dto,
            },
        });
        return question;
    }

    async findAll(id: string) {
        const test = await this.prismaService.test.findUnique({ where: { id } });
        if (!test) {
            throw new NotFoundException();
        }

        return this.prismaService.question.findMany({
            where: { testId: id },

            include: {
                answers: true,
            },
        });
    }

    // async findAll(id: string) {
    //     const test = await this.prismaService.test.findUnique({ where: { id } });
    //     if (!test) {
    //         throw new NotFoundException();
    //     }
    //
    //     return this.prismaService.question.findMany({
    //         where: {
    //             testId: id,
    //             answers: {
    //                 some: {
    //                     isCorrect: true,
    //                 },
    //             },
    //         },
    //         include: {
    //             answers: true,
    //         },
    //     });
    // }

    async delete(id: string) {
        const question = await this.prismaService.question.findUnique({ where: { id } });
        if (!question) {
            throw new NotFoundException();
        }

        return this.prismaService.question.delete({ where: { id }, select: { id: true } });
    }
}
