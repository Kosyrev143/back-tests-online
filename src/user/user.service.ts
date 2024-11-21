import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User } from '@prisma/client';
import { genSalt, genSaltSync, hash, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  save(user: Partial<User>) {
    const hashedPassword = this.hashedPassword(user.password);

    return this.prismaService.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        roles: ['USER'],
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

  delete(id: string) {
    return this.prismaService.user.delete({ where: { id } });
  }

  private hashedPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
