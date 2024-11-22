import {
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from '@user/responses';
import { CurrentUser, Roles } from '@common/decorators';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { JwtPayloadInterface } from '@auth/interfaces';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':idOrEmail')
    async findOne(@Param('idOrEmail') idOrEmail: string) {
        const user = await this.userService.findOne(idOrEmail, true);
        return new UserResponse(user);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async findAll() {
        const users = await this.userService.findAll();
        return users.map((user) => new UserResponse(user));
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayloadInterface) {
        return this.userService.delete(id, user);
    }
}
