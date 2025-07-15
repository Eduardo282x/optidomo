import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignDeviceDto } from './area-device.dto';

@Injectable()
export class AreaDeviceService {

    constructor(private readonly prismaService: PrismaService) {

    }

    async getAreaDevice() {
        return await this.prismaService.areaDevice.findMany({
            include: {
                area: true,
                device: true
            },
            orderBy: { id: 'asc' }
        });
    }

    async assignAreaDevice(areaDevice: AssignDeviceDto) {
        try {
            await this.prismaService.areaDevice.create({
                data: {
                    name: areaDevice.name,
                    areaId: areaDevice.areaId,
                    deviceId: areaDevice.deviceId
                }
            });
            baseResponse.message = 'Dispositivo asignado.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
    async updateAreaDevice(id: number, areaDevice: AssignDeviceDto) {
        try {
            await this.prismaService.areaDevice.update({
                data: {
                    name: areaDevice.name,
                    areaId: areaDevice.areaId,
                    deviceId: areaDevice.deviceId
                },
                where: { id }
            });
            baseResponse.message = 'Dispositivo asignado actualizado.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
    async removeAreaDevice(id: number) {
        try {
            await this.prismaService.areaDevice.delete({
                where: { id }
            });
            baseResponse.message = 'Dispositivo removido.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
}
