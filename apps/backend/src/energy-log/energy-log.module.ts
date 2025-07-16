import { Module } from '@nestjs/common';
import { EnergyLogController } from './energy-log.controller';
import { EnergyLogService } from './energy-log.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [EnergyLogController],
  providers: [EnergyLogService, PrismaService],
  exports: [EnergyLogService]
})
export class EnergyLogModule {}
