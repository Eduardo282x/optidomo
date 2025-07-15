import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AreaDeviceService } from './area-device.service';
import { AssignDeviceDto } from './area-device.dto';

@Controller('area-device')
export class AreaDeviceController {

    constructor(private readonly areaDeviceService: AreaDeviceService) {

    }

    @Get()
    async getAreaDevice() {
        return await this.areaDeviceService.getAreaDevice();
    }

    @Post()
    async assignAreaDevice(@Body() area: AssignDeviceDto) {
        return await this.areaDeviceService.assignAreaDevice(area);
    }
    @Put('/:id')
    async updateAreaDevice(@Param('id', ParseIntPipe) id: number, @Body() area: AssignDeviceDto) {
        return await this.areaDeviceService.updateAreaDevice(id, area);
    }
    @Delete('/:id')
    async removeAreaDevice(@Param('id', ParseIntPipe) id: number) {
        return await this.areaDeviceService.removeAreaDevice(id);
    }
}
