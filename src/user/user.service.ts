import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { convertToSecondsUtil } from '@common/utils';
import { JwtPayloadInterface } from '@auth/interfaces';

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
    ) {}

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

    async findOne(idOrEmail: string, isReset = false): Promise<User> {
        if (isReset) {
            await this.cacheManager.del(idOrEmail);
        }
        const user = await this.cacheManager.get<User>(idOrEmail);
        if (!user) {
            const user = await this.prismaService.user.findFirst({
                where: {
                    OR: [{ id: idOrEmail }, { email: idOrEmail }],
                },
            });
            if (!user) {
                return null;
            }
            await this.cacheManager.set(idOrEmail, user, convertToSecondsUtil(this.configService.get('JWT_EXP')));
            return user;
        }
        return user;
    }

    findAll() {
        return this.prismaService.user.findMany();
    }

    async delete(id: string, user: JwtPayloadInterface) {
        const avlUser = await this.prismaService.user.findUnique({ where: { id } });
        if (!avlUser) {
            throw new NotFoundException();
        }

        await Promise.all([this.cacheManager.del(user.id), this.cacheManager.del(user.email)]);
        return this.prismaService.user.delete({ where: { id }, select: { id: true } });
    }

    private hashedPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }
}
