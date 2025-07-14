import { Controller, Get } from '@nestjs/common';
import { AreaDeviceService } from './area-device.service';

@Controller('area-device')
export class AreaDeviceController {

    constructor(private readonly areaDeviceService: AreaDeviceService) {
        
    }

    @Get()
    async getAreaDevice() {
        return await this.areaDeviceService.getAreaDevice();
    }
}
