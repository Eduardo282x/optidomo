import { Module } from '@nestjs/common';
import { AreaDeviceController } from './area-device.controller';
import { AreaDeviceService } from './area-device.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnergyLogService } from 'src/energy-log/energy-log.service';

@Module({
  controllers: [AreaDeviceController],
  providers: [AreaDeviceService, PrismaService, EnergyLogService]
})
export class AreaDeviceModule {}
