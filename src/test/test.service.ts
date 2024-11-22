import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateTestDto } from './dto';
import { JwtPayloadInterface } from '@auth/interfaces';

@Injectable()
export class TestService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(dto: CreateTestDto, user: JwtPayloadInterface) {
        const _test = await this.prismaService.test.findFirst({ where: { title: dto.title } });
        if (_test) {
            throw new ConflictException();
        }

        const avlCategory = await this.prismaService.category.findFirst({ where: { id: dto.categoryId } });
        if (!avlCategory) {
            throw new NotFoundException();
        }

        const test = await this.prismaService.test.create({
            data: {
                ...dto,
                authorId: user.id,
            },
            include: {
                Category: true,
            },
        });
        return test; // Возвращаем созданный тест
    }

    async findAll() {
        const tests = await this.prismaService.test.findMany({
            include: {
                questions: {
                    include: {
                        answers: true, // Включаем ответы для каждого вопроса
                    },
                },
                Category: {
                    select: {
                        name: true,
                    },
                },
                author: true,
            },
        });

        return tests.map((test) => ({
            ...test,
            categoryName: test.Category?.name || null,
            Category: undefined,
            categoryId: undefined,
            questions: undefined,
        }));
    }

    async findMyTests(userId: string) {
        // Получаем тесты, принадлежащие текущему пользователю
        const tests = await this.prismaService.test.findMany({
            where: { authorId: userId },
            include: {
                questions: {
                    include: {
                        answers: true, // Включаем ответы для каждого вопроса
                    },
                },
                Category: {
                    select: {
                        name: true,
                    },
                },
                author: true,
            },
        });

        return tests.map((test) => ({
            ...test,
            categoryName: test.Category?.name || null,
            Category: undefined,
            categoryId: undefined,
            questions: undefined,
        }));
    }

    async findOtherTests(userId: string) {
        // Получаем тесты, которые не принадлежат текущему пользователю
        const tests = await this.prismaService.test.findMany({
            where: { authorId: { not: userId } },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
                Category: {
                    select: {
                        name: true,
                    },
                },
                author: true,
            },
        });

        const filteredTests = tests.filter((test) => {
            return test.questions.every((question) => {
                return question.answers.some((answer) => answer.isCorrect === true);
            });
        });

        return filteredTests.map((test) => ({
            ...test,
            categoryName: test.Category?.name || null,
            Category: undefined,
            categoryId: undefined,
            questions: undefined,
        }));
    }

    async delete(id: string) {
        const test = await this.prismaService.test.findUnique({ where: { id } });
        if (!test) {
            throw new NotFoundException();
        }

        return this.prismaService.test.delete({ where: { id }, select: { id: true } });
    }
}
