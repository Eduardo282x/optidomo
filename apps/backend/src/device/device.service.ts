import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeviceDto } from './device.dto';

@Injectable()
export class DeviceService {

    constructor(private readonly prismaService: PrismaService) {

    }

    async getDevices() {
        return await this.prismaService.device.findMany();
    }

    async saveDevice(device: CreateDeviceDto) {
        try {
            await this.prismaService.device.create({
                data: {
                    name: device.name,
                    powerWatts: device.powerWatts,
                    type: device.type
                }
            })
            baseResponse.message = 'Dispositivo guardado.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
    async updateDevice(id: number, device: CreateDeviceDto) {
        try {
            await this.prismaService.device.update({
                data: {
                    name: device.name,
                    powerWatts: device.powerWatts,
                    type: device.type
                },
                where: { id }
            })
            baseResponse.message = 'Dispositivo actualizado.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
    async deleteDevice(id: number) {
        try {
            await this.prismaService.device.delete({
                where: { id }
            })
            baseResponse.message = 'Dispositivo eliminado.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
}
