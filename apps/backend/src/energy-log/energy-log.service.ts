import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnergyLogService {

    constructor(private prisma: PrismaService) { }

    async turnOn(deviceId: number, areaId: number) {
        // Asegúrate de que no está ya encendido
        const active = await this.prisma.energyLog.findFirst({
            where: { deviceId, endedAt: null },
        });

        if (active) return active;

        return this.prisma.energyLog.create({
            data: {
                deviceId,
                areaId,
                startedAt: new Date(),
            },
        });
    }

    async turnOff(deviceId: number) {
        const active = await this.prisma.energyLog.findFirst({
            where: { deviceId, endedAt: null },
            include: { device: true },
        });

        if (!active) return null;

        const endedAt = new Date();
        const hours = (endedAt.getTime() - active.startedAt.getTime()) / (1000 * 60 * 60);
        const totalWh = active.device.powerWatts * hours;

        return this.prisma.energyLog.update({
            where: { id: active.id },
            data: {
                endedAt,
                totalWh,
            },
        });
    }
}

