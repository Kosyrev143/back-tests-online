import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

    @Public()
    @Get()
    findAll() {
        return this.testService.findAll();
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.testService.delete(id);
    }
}
