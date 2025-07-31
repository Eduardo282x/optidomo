import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignDeviceDto } from './area-device.dto';
import { EnergyLogService } from 'src/energy-log/energy-log.service';

@Injectable()
export class AreaDeviceService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly energyLogService: EnergyLogService
    ) {

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

    async toggleDevicesByArea(areaId: number, type: 'AC' | 'LIGHT', status: boolean) {
        const devices = await this.prismaService.areaDevice.findMany({ where: { device: { type }, areaId } });
        const updated = await this.prismaService.areaDevice.updateMany({
            where: { device: { type }, areaId },
            data: { isOn: status }
        });

        devices.map(async (dev) => {
            if (status) {
                await this.energyLogService.turnOn(dev.id)
            } else {
                await this.energyLogService.turnOff(dev.id)
            }
        })

        // OPCIONAL: registrar en EnergyLog si es necesario
        return updated;
    }
    async toggleAllDevices(type: 'AC' | 'LIGHT', status: boolean) {
        const devices = await this.prismaService.areaDevice.findMany({ where: { device: { type } } });
        const updated = await this.prismaService.areaDevice.updateMany({
            where: { device: { type } },
            data: { isOn: status }
        });

        devices.map(async (dev) => {
            if (status) {
                await this.energyLogService.turnOn(dev.id)
            } else {
                await this.energyLogService.turnOff(dev.id)
            }
        })

        // OPCIONAL: registrar en EnergyLog si es necesario
        return updated;
    }

    async toggleDevice(id: number) {
        const device = await this.prismaService.areaDevice.findUnique({ where: { id } });
        const updated = await this.prismaService.areaDevice.update({
            where: { id },
            data: { isOn: !device.isOn }
        });

        if (updated.isOn) {
            await this.energyLogService.turnOn(updated.id)
        } else {
            await this.energyLogService.turnOff(updated.id)
        }
        // OPCIONAL: registrar en EnergyLog si es necesario
        return updated;
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
