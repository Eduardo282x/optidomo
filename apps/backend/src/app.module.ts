import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AreaModule } from './area/area.module';
import { DeviceModule } from './device/device.module';
import { AreaDeviceModule } from './area-device/area-device.module';
import { EnergyLogModule } from './energy-log/energy-log.module';
import { AccessLogModule } from './access-log/access-log.module';
import { ReportModule } from './report/report.module';
import { PrismaService } from './prisma/prisma.service';
import { MainLoadModule } from './main-load/main-load.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'frontend/dist'),
    }),
    AuthModule,
    UserModule,
    AreaModule,
    DeviceModule,
    AreaDeviceModule,
    EnergyLogModule,
    AccessLogModule,
    ReportModule,
    MainLoadModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
