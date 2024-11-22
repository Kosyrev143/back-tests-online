import {
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from '@user/responses';
import { CurrentUser } from '@common/decorators';
import { JwtPayloadInterface } from '@auth/interfaces';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':idOrEmail')
    async findOne(@Param('idOrEmail') idOrEmail: string) {
        const user = await this.userService.findOne(idOrEmail);
        return new UserResponse(user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async findAll(@CurrentUser() user: JwtPayloadInterface) {
        const users = await this.userService.findAll(user);
        return users.map((user) => new UserResponse(user));
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayloadInterface) {
        return this.userService.delete(id, user);
    }
}
