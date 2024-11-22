import { Controller, Post, Body, UnauthorizedException, Param, Get } from '@nestjs/common';
import { ResultService } from './result.service';
import { RecordResultDto } from './dto';
import { CurrentUser } from '@common/decorators';
import { JwtPayloadInterface } from '@auth/interfaces';

@Controller('result')
export class ResultController {
    constructor(private readonly resultService: ResultService) {}

    @Post('record')
    async recordResult(@Body() dto: RecordResultDto, @CurrentUser() user: JwtPayloadInterface) {
        if (!user) {
            throw new UnauthorizedException();
        }

        return this.resultService.recordResult(user.id, dto.testId, dto.answers);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.resultService.findOne(id);
    }
}
