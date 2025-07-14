import { Injectable } from '@nestjs/common';
import { AccessType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccessLogService {
    constructor(private prisma: PrismaService) { }

    logAccess(userId: number, areaId: number, type: AccessType) {
        return this.prisma.accessLog.create({
            data: {
                userId,
                areaId,
                type,
                timestamp: new Date(),
            },
        });
    }

    findByArea(areaId: number) {
        return this.prisma.accessLog.findMany({
            where: { areaId },
            include: { user: true },
            orderBy: { timestamp: 'desc' },
        });
    }
}
