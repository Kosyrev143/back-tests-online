import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@user/user.module';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { options } from '@auth/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [PassportModule, JwtModule.registerAsync(options()), UserModule],
})
export class AuthModule {}
