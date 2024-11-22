import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { genSalt, genSaltSync, hash, hashSync } from 'bcrypt';
import { JwtPayloadInterface } from '@auth/interfaces';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    save(user: Partial<User>) {
        const hashedPassword = this.hashedPassword(user.password);

        return this.prismaService.user.create({
            data: {
                email: user.email,
                password: hashedPassword,
                roles: user.roles?.length ? user.roles : ['USER'],
            },
        });
    }

    findOne(idOrEmail: string) {
        return this.prismaService.user.findFirst({
            where: {
                OR: [{ id: idOrEmail }, { email: idOrEmail }],
            },
        });
    }

    findAll() {
        return this.prismaService.user.findMany();
    }

    delete() {
        return this.prismaService.user.delete({ where: { id }, select: { id: true } });
    }

    private hashedPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }
}
