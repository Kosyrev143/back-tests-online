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
            },
        });

        // Фильтруем тесты, оставляя только те, у которых у всех вопросов есть хотя бы один правильный ответ
        const filteredTests = tests.filter((test) => {
            return test.questions.every((question) => {
                // Проверяем, есть ли хотя бы один правильный ответ у каждого вопроса
                return question.answers.some((answer) => answer.isCorrect === true);
            });
        });

        // Возвращаем тесты с необходимыми полями
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
