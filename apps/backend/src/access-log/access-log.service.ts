import { Injectable } from '@nestjs/common';
import { AccessType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LogAccessDto } from './access-log.dto';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { badResponse, baseResponse } from 'src/base/base.interface';

@Injectable()
export class AccessLogService {
    constructor(
        private prismaService: PrismaService,
        private websocketGateway: WebsocketGateway

    ) { }

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

    async logAccess(accessLog: LogAccessDto) {
        const { userId, areaId } = accessLog;

        const findLastAccessUser = await this.prismaService.accessLog.findFirst({
            orderBy: { id: 'desc' },
            where: { userId }
        });

        const findStudent = await this.prismaService.user.findFirst({
            where: { id: userId }
        })

        if (findStudent && findStudent.role == 'STUDENT') {
            if (findStudent.isPaid == false) {
                badResponse.message = 'No puede pasar'
                return badResponse;
            }
        }

        await this.prismaService.accessLog.create({
            data: {
                userId,
                areaId,
                type: findLastAccessUser ? (findLastAccessUser.type == 'EXIT' ? 'ENTRY' : 'EXIT') : 'EXIT',
                timestamp: new Date(),
            },
        });

        this.websocketGateway.server.emit('accessLogUpdate', 'Actualiza')
        baseResponse.message = 'Acceso registrado'
        return baseResponse
    }
}
