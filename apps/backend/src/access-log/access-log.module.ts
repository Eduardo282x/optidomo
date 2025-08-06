import { Module } from '@nestjs/common';
import { AccessLogController } from './access-log.controller';
import { AccessLogService } from './access-log.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Module({
  controllers: [AccessLogController],
  providers: [AccessLogService, PrismaService, WebsocketGateway]
})
export class AccessLogModule {}
