import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class ResultService {
    constructor(private readonly prismaService: PrismaService) {}

    async recordResult(userId: string, testId: string, answersIds: string[]) {
        // Проверяем существование теста и пользователя
        const test = await this.prismaService.test.findUnique({ where: { id: testId } });
        const user = await this.prismaService.user.findUnique({ where: { id: userId } });

        if (!test || !user) {
            throw new NotFoundException('Test or User not found');
        }
        console.log(answersIds);
        // Проверяем ответы пользователя и подсчитываем правильные
        let correctAnswersCount = 0;
        const allAnswers = await this.prismaService.answer.findMany({
            where: { id: { in: answersIds } },
        });
        console.log(allAnswers);

        if (!allAnswers) {
            throw new NotFoundException();
        }

        allAnswers.forEach((answer) => {
            if (answer.isCorrect) {
                correctAnswersCount++;
            }
        });

        // Рассчитываем процент правильных ответов
        const score = +((correctAnswersCount / allAnswers.length) * 100).toFixed(2);

        // Создаем запись результата
        const result = await this.prismaService.result.create({
            data: {
                userId,
                testId,
                score,
            },
        });

        // Добавляем ответы в промежуточную таблицу
        const _resultAnswers = answersIds.map((answerId) => ({
            resultId: result.id,
            answerId,
        }));

        await this.prismaService.resultAnswer.createMany({ data: _resultAnswers });
        return result;
    }

    async findOne(id: string) {
        return this.prismaService.result.findUnique({ where: { id }, include: { user: true, test: true } });
    }
}
