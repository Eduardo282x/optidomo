import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './area.dto';

@Controller('area')
export class AreaController {

    constructor(private readonly areaService: AreaService) {

    }

    @Get()
    async getAreas() {
        return await this.areaService.getAreas();
    }

    @Post()
    async createArea(@Body() area: CreateAreaDto) {
        return await this.areaService.createArea(area);
    }
    @Put('/:id')
    async updateArea(@Param('id', ParseIntPipe) id: number, @Body() area: CreateAreaDto) {
        return await this.areaService.updateArea(id, area);
    }
    @Delete('/:id')
    async deleteArea(@Param('id', ParseIntPipe) id: number) {
        return await this.areaService.deleteArea(id);
    }
}
