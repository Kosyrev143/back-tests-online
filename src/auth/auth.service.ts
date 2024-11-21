import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { LoginDto, RegisterDto } from '@auth/dto';
import { UserService } from '@user/user.service';
import { Tokens } from '@auth/interfaces/token.interface';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { Token, User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async refreshTokens(
    refreshToken: string,
    userAgent: string,
  ): Promise<Tokens> {
    const token = await this.prismaService.token.findUnique({
      where: { token: refreshToken },
    });
    if (!token) {
      throw new UnauthorizedException();
    }
    await this.prismaService.token.delete({
      where: { token: refreshToken },
    });
    if (new Date(token.exp) < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne(token.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.generateTokens(user, userAgent);
  }

  async register(dto: RegisterDto) {
    const user = await this.userService.findOne(dto.email).catch((err) => {
      this.logger.error(err);
      return null;
    });
    if (user) {
      throw new ConflictException('Такой пользователь уже существует');
    }

    return this.userService.save(dto).catch((err) => {
      this.logger.error(err);
      return null;
    });
  }

  async login(dto: LoginDto, userAgent: string): Promise<Tokens> {
    const user = await this.userService.findOne(dto.email).catch((err) => {
      this.logger.error(err);
      return null;
    });
    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return this.generateTokens(user, userAgent);
  }

  private async generateTokens(user: User, userAgent): Promise<Tokens> {
    const accessToken =
      'Bearer ' +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });
    const refreshToken = await this.getRefreshToken(user.id, userAgent);
    return { accessToken, refreshToken };
  }

  private async getRefreshToken(
    userId: string,
    userAgent: string,
  ): Promise<Token> {
    const _token = await this.prismaService.token.findFirst({
      where: { userId, userAgent },
    });
    const token = _token?.token ?? '';

    return this.prismaService.token.upsert({
      where: { token },
      update: {},
      create: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
        userId,
        userAgent: userAgent,
      },
    });
  }
}
