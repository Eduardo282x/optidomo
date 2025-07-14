import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAreaDto } from './area.dto';

@Injectable()
export class AreaService {

    constructor(private readonly prismaService: PrismaService) {

    }

    async getAreas() {
        return await this.prismaService.area.findMany();
    }

    async createArea(area: CreateAreaDto) {
        try {
            await this.prismaService.area.create({
                data: { name: area.name }
            });

            baseResponse.message = 'Area creada.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async updateArea(id: number, area: CreateAreaDto) {
        try {
            await this.prismaService.area.update({
                data: { name: area.name },
                where: { id }
            });

            baseResponse.message = 'Area actualizada.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async deleteArea(id: number) {
        try {
            await this.prismaService.area.delete({
                where: { id }
            });

            baseResponse.message = 'Area eliminada.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
}
