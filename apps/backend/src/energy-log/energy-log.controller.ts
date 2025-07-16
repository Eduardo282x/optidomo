import { Body, Controller, Get, Post } from '@nestjs/common';
import { EnergyLogService } from './energy-log.service';
import { ToggleEnergyLog } from './energy-log.dto';

@Controller('energy-log')
export class EnergyLogController {

    constructor(private readonly energyLogService: EnergyLogService) {

    }

    @Get()
    async getEnergyLog() {
        return await this.energyLogService.getEnergyLog();
    }

    @Post('/turn-on')
    async turnOn(@Body() turn: ToggleEnergyLog) {
        return await this.energyLogService.turnOn(turn.areaDeviceId);
    }
    @Post('/turn-off')
    async turnOff(@Body() turn: ToggleEnergyLog) {
        return await this.energyLogService.turnOff(turn.areaDeviceId);
    }
}
