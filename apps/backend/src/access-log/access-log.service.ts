import { Injectable } from '@nestjs/common';
import { AccessType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LogAccessDto } from './access-log.dto';

@Injectable()
export class AccessLogService {
    constructor(private prismaService: PrismaService) { }

    getAccessControl() {
        return this.prismaService.accessLog.findMany({
            include: { user: true, area: true },
            orderBy: { timestamp: 'desc' },
        });
    }

    findByArea(areaId: number) {
        return this.prismaService.accessLog.findMany({
            where: { areaId },
            include: { user: true, area: true },
            orderBy: { timestamp: 'desc' },
        });
    }

    logAccess(accessLog: LogAccessDto) {
        const { userId, areaId, type } = accessLog;
        return this.prismaService.accessLog.create({
            data: {
                userId,
                areaId,
                type,
                timestamp: new Date(),
            },
        });
    }
}
