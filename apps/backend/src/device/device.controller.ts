import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './device.dto';

@Controller('device')
export class DeviceController {

    constructor(private readonly deviceService: DeviceService) {

    }

    @Get()
    async getDevices() {
        return await this.deviceService.getDevices();
    }

    @Post()
    async saveDevice(@Body() device: CreateDeviceDto) {
        return await this.deviceService.saveDevice(device);
    }
    @Put('/:id')
    async updateDevice(@Param('id', ParseIntPipe) id: number, @Body() device: CreateDeviceDto) {
        return await this.deviceService.updateDevice(id, device);
    }
    @Delete('/:id')
    async deleteDevice(@Param('id', ParseIntPipe) id: number) {
        return await this.deviceService.deleteDevice(id);
    }
}
