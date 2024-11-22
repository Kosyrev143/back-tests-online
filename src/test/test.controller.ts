import { Body, Controller, Delete, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto';
import { CurrentUser, Public } from '@common/decorators';
import { JwtPayloadInterface } from '@auth/interfaces';

@Controller('test')
export class TestController {
    constructor(private readonly testService: TestService) {}

    @Post()
    create(@Body() dto: CreateTestDto, @CurrentUser() user: JwtPayloadInterface) {
        return this.testService.create(dto, user);
    }

    @Get()
    findAll() {
        return this.testService.findAll();
    }

    @Get('my-tests')
    findMyTests(@CurrentUser() user: JwtPayloadInterface) {
        if (!user) {
            throw new UnauthorizedException();
        }
        // Метод для получения тестов текущего пользователя
        return this.testService.findMyTests(user.id);
    }

    @Get('other-tests')
    findOtherTests(@CurrentUser() user: JwtPayloadInterface) {
        if (!user) {
            throw new UnauthorizedException();
        }
        // Метод для получения тестов, не принадлежащих текущему пользователю
        return this.testService.findOtherTests(user.id);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.testService.delete(id);
    }
}
