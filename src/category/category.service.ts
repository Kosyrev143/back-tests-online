import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private readonly prismaService: PrismaService) {}

    create(dto: CreateCategoryDto) {
        return this.prismaService.category.create({
            data: {
                ...dto,
            },
        });
    }

    async findAll() {
        return this.prismaService.category.findMany();
    }

    async delete(id: string) {
        const category = await this.prismaService.category.findUnique({ where: { id } });
        if (!category) {
            throw new NotFoundException();
        }

        return this.prismaService.category.delete({ where: { id }, select: { id: true } });
    }
}
