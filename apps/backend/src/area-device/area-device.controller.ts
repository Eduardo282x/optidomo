import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
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
    @Put('/toggleByArea')
    async toggleDevicesByArea(@Query('areaId', ParseIntPipe) areaId: number, @Query('type') type: 'AC' | 'LIGHT', @Query('status', ParseBoolPipe) status: boolean) {
        return await this.areaDeviceService.toggleDevicesByArea(areaId, type, status);
    }
    @Put('/toggle')
    async toggleAllDevices(@Query('type') type: 'AC' | 'LIGHT', @Query('status', ParseBoolPipe) status: boolean) {
        return await this.areaDeviceService.toggleAllDevices(type, status);
    }
    @Put('/toggle/:id')
    async toggleDevice(@Param('id', ParseIntPipe) id: number) {
        return await this.areaDeviceService.toggleDevice(id);
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
