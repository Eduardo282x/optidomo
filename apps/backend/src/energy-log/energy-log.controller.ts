import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { EnergyLogService } from './energy-log.service';
import { ToggleEnergyLog, BodyReportDTO } from './energy-log.dto';
import { Response } from 'express';
@Controller('energy-log')
export class EnergyLogController {

    constructor(private readonly energyLogService: EnergyLogService) {

    }

    @Get()
    async getEnergyLog() {
        return await this.energyLogService.getEnergyLog();
    }

    @Get('energy-log/today')
    getEnergyLogChartDataToday() {
        return this.energyLogService.getEnergyLogChartDataToday();
    }

    @Get('energy-log/day')
    getByDay(@Query('date') date: string) {
        return this.energyLogService.getEnergyLogChartDate(new Date(date));
    }

    @Get('energy-log/range')
    getByRange(@Query('start') start: string, @Query('end') end: string) {
        return this.energyLogService.getEnergyLogByRange(new Date(start), new Date(end));
    }

    @Get('energy-log/chart')
    getChart(@Query('start') start: string, @Query('end') end: string) {
        return this.energyLogService.getEnergyLogChartData(new Date(start), new Date(end));
    }

    @Post('/report')
    async exportReporteExcel(
        @Body() bodyReport: BodyReportDTO,
        @Res() res: Response
    ) {
        return this.energyLogService.generateConsumptionReport(bodyReport.type, bodyReport.date, res);
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
