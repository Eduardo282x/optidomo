import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AccessLogService } from './access-log.service';
import { LogAccessDto } from './access-log.dto';

@Controller('access-log')
export class AccessLogController {

    constructor(private readonly accessLogService: AccessLogService) {
        
    }

    @Get()
    async getAccessControl() {
        return await this.accessLogService.getAccessControl();
    }
    @Get('/area/:id')
    async findByArea(@Param('id', ParseIntPipe) id: number) {
        return await this.accessLogService.findByArea(id);
    }
    @Post()
    async logAccess(@Body() access: LogAccessDto) {
        return await this.accessLogService.logAccess(access);
    }
}
