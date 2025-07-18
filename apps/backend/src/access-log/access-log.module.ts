import { Module } from '@nestjs/common';
import { AccessLogController } from './access-log.controller';
import { AccessLogService } from './access-log.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AccessLogController],
  providers: [AccessLogService, PrismaService]
})
export class AccessLogModule {}
