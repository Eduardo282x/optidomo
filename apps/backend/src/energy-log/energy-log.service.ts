import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnergyLogService {

    constructor(private prisma: PrismaService) { }

    async getEnergyLog() {
        try {
            return await this.prisma.energyLog.findMany({
                include: {
                    areaDevice: true,
                }
            })
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async turnOn(areaDeviceId: number) {
        try {
            // Asegúrate de que no está ya encendido
            const active = await this.prisma.energyLog.findFirst({
                where: { areaDeviceId, endedAt: null },
            });

            if (active) return active;

            await this.prisma.energyLog.create({
                data: {
                    areaDeviceId,
                    startedAt: new Date(),
                },
            });

            baseResponse.message = 'Dispositivo apagado';
            return baseResponse;
        } catch (err) {
            badResponse.message = `Error al apagar ${err.message}`
            return badResponse;
        }
    }

    async turnOff(areaDeviceId: number) {
        try {
            const active = await this.prisma.energyLog.findFirst({
                where: {
                    areaDeviceId,
                    endedAt: null
                },
                orderBy: {
                    startedAt: 'desc'
                },
                include: {
                    areaDevice: {
                        include: {
                            device: true
                        }
                    }
                }
            })

            if (!active) return null;

            const durationHours = (new Date().getTime() - active.startedAt.getTime()) / (1000 * 60 * 60);
            const totalWh = active.areaDevice.device.powerWatts * durationHours;

            await this.prisma.energyLog.update({
                where: { id: active.id },
                data: {
                    endedAt: new Date(),
                    totalWh: totalWh
                }
            });

            baseResponse.message = 'Dispositivo apagado';
            return baseResponse;
        } catch (err) {
            badResponse.message = `Error al apagar ${err.message}`
            return badResponse;
        }
    }
}

