import { Injectable } from '@nestjs/common';
import { badResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MainLoadService {
    constructor(private prisma: PrismaService) { }

    async run() {
        try {
            // Si ya hay datos, evitar duplicar
            const exists = await this.prisma.user.findFirst();
            if (exists) return { message: 'Datos ya cargados.' };

            // Crear usuarios
            const admin = await this.prisma.user.create({
                data: {
                    fullName: 'Carlos Mendoza',
                    email: 'admin@optidomo.edu',
                    password: 'admin123',
                    role: 'ADMIN',
                    isPaid: true,
                },
            });

            const docente1 = await this.prisma.user.create({
                data: {
                    fullName: 'María González',
                    email: 'maria@optidomo.edu',
                    password: 'docente123',
                    role: 'TEACHER',
                    isPaid: true,
                },
            });

            const estudiante1 = await this.prisma.user.create({
                data: {
                    fullName: 'Pedro Ramírez',
                    email: 'pedro@optidomo.edu',
                    password: '123456',
                    role: 'STUDENT',
                    isPaid: true,
                },
            });

            const estudiante2 = await this.prisma.user.create({
                data: {
                    fullName: 'Ana Torres',
                    email: 'ana@optidomo.edu',
                    password: '123456',
                    role: 'STUDENT',
                    isPaid: false,
                },
            });

            // Crear áreas
            const entrada = await this.prisma.area.create({ data: { name: 'Entrada principal' } });
            const salonA = await this.prisma.area.create({ data: { name: 'Salón A' } });
            const salonB = await this.prisma.area.create({ data: { name: 'Salón B' } });
            const comedor = await this.prisma.area.create({ data: { name: 'Comedor' } });

            // Crear dispositivos
            const luzSalonA = await this.prisma.device.create({
                data: { name: 'Lámpara LED', type: 'LIGHT', powerWatts: 15 },
            });

            const aireSalonA = await this.prisma.device.create({
                data: { name: 'Aire acondicionado', type: 'AC', powerWatts: 1800 },
            });

            const luzEntrada = await this.prisma.device.create({
                data: { name: 'Luz Led', type: 'LIGHT', powerWatts: 20 },
            });

            const aireComedor = await this.prisma.device.create({
                data: { name: 'Aire comedor', type: 'AC', powerWatts: 1500 },
            });

            // Asignar dispositivos a áreas
            await this.prisma.areaDevice.createMany({
                data: [
                    { name: '', areaId: salonA.id, deviceId: luzSalonA.id },
                    { name: '', areaId: salonA.id, deviceId: aireSalonA.id },
                    { name: '', areaId: entrada.id, deviceId: luzEntrada.id },
                    { name: '', areaId: comedor.id, deviceId: aireComedor.id },
                ],
            });

            // Registrar entrada del docente
            await this.prisma.accessLog.create({
                data: {
                    userId: docente1.id,
                    areaId: salonA.id,
                    type: 'ENTRY',
                    timestamp: new Date(),
                },
            });

            // Registrar entrada de estudiante pagado
            await this.prisma.accessLog.create({
                data: {
                    userId: estudiante1.id,
                    areaId: entrada.id,
                    type: 'ENTRY',
                    timestamp: new Date(),
                },
            });

            // Registrar intento de entrada de estudiante no pagado
            await this.prisma.accessLog.create({
                data: {
                    userId: estudiante2.id,
                    areaId: entrada.id,
                    type: 'ENTRY',
                    timestamp: new Date(),
                },
            });

            return { message: 'Datos cargados correctamente.' };
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
}
