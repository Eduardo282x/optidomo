import { Injectable } from '@nestjs/common';
import { DeviceType } from '@prisma/client';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnergyLogFilters, ApiResponse, HourlyEnergyData, DailyEnergyData, AreaEnergyData, DeviceTypeEnergyData, DashboardStats } from './energy-log.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class EnergyLogService {

    constructor(private prisma: PrismaService) { }

    async getEnergyLogByDay(date: Date) {
        try {
            // Calcula el inicio y fin del día
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);

            return await this.prisma.energyLog.findMany({
                where: {
                    startedAt: {
                        gte: start,
                        lte: end,
                    },
                },
                include: {
                    areaDevice: true,
                },
            });
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async getEnergyLogByRange(startDate: Date, endDate: Date) {
        try {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            return await this.prisma.energyLog.findMany({
                where: {
                    startedAt: {
                        gte: start,
                        lte: end,
                    },
                },
                include: {
                    areaDevice: {
                        include: {
                            device: true,
                            area: true
                        }
                    },
                },
            });
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async getEnergyLogChartData(startDate: Date, endDate: Date) {
        const logs = await this.getEnergyLogByRange(startDate, endDate);
        if (!Array.isArray(logs)) return logs;

        // Agrupa por hora y suma el totalWh
        const chartData: { hour: string, totalWh: number, date: string }[] = [];
        const grouped: Record<string, number> = {};

        logs.forEach(log => {
            // Formato: yyyy-mm-dd HH:00 para agrupar por hora
            const dateHour = log.startedAt.toISOString().slice(0, 13) + ':00:00'; // yyyy-mm-ddTHH:00:00
            const hourKey = log.startedAt.toISOString().slice(0, 13); // yyyy-mm-ddTHH

            grouped[hourKey] = (grouped[hourKey] || 0) + (log.totalWh || 0);
        });

        for (const hourKey in grouped) {
            const date = hourKey.slice(0, 10); // yyyy-mm-dd
            const hour = hourKey.slice(11, 13) + ':00'; // HH:00
            const fullDateTime = hourKey.slice(0, 10) + ' ' + hour; // yyyy-mm-dd HH:00

            chartData.push({
                hour: fullDateTime,
                totalWh: grouped[hourKey],
                date: date
            });
        }

        // Ordena por fecha y hora ascendente
        chartData.sort((a, b) => a.hour.localeCompare(b.hour));

        return chartData;
    }

    async getEnergyLogChartDataToday() {
        const today = new Date()
        const logs = await this.getEnergyLogByRange(today, today);
        if (!Array.isArray(logs)) return logs;

        const grouped: Record<string, number> = {};

        logs.forEach(log => {
            const hour = log.startedAt.getHours().toString().padStart(2, '0') + ':00';
            grouped[hour] = (grouped[hour] || 0) + (log.totalWh || 0);
        });

        const chartData = Object.entries(grouped)
            .map(([time, energy]) => ({ time, energy }))
            .sort((a, b) => a.time.localeCompare(b.time)); // Ordenar por hora ascendente

        const energyLogArea = await this.getEnergyLogChartByArea(today, today)
        return {
            totalConsumptionLight: logs.filter(item => item.areaDevice.device.type == 'LIGHT').reduce((acc, item) => acc + item.totalWh, 0),
            totalConsumptionAC: logs.filter(item => item.areaDevice.device.type == 'AC').reduce((acc, item) => acc + item.totalWh, 0),
            totalConsumption: logs.reduce((acc, item) => acc + item.totalWh, 0),
            chartDataEnergy: chartData,
            chartDataArea: energyLogArea
        };
    }

    async getEnergyLogChartDate(date: Date) {
        const logs = await this.getEnergyLogByRange(date, date);
        if (!Array.isArray(logs)) return logs;

        const grouped: Record<string, number> = {};

        logs.forEach(log => {
            const hour = log.startedAt.getHours().toString().padStart(2, '0') + ':00';
            grouped[hour] = (grouped[hour] || 0) + (log.totalWh || 0);
        });

        const chartData = Object.entries(grouped)
            .map(([time, energy]) => ({ time, energy }))
            .sort((a, b) => a.time.localeCompare(b.time)); // Ordenar por hora ascendente

        const energyLogArea = await this.getEnergyLogChartByArea(date, date)
        return {
            totalConsumptionLight: logs.filter(item => item.areaDevice.device.type == 'LIGHT').reduce((acc, item) => acc + item.totalWh, 0),
            totalConsumptionAC: logs.filter(item => item.areaDevice.device.type == 'AC').reduce((acc, item) => acc + item.totalWh, 0),
            totalConsumption: logs.reduce((acc, item) => acc + item.totalWh, 0),
            chartDataEnergy: chartData,
            chartDataArea: energyLogArea
        };
    }

    // Versión alternativa si solo quieres las últimas 24 horas con todas las horas del día
    async getEnergyLogChartDataLast24Hours() {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // 24 horas atrás

        const logs = await this.getEnergyLogByRange(startDate, endDate);
        if (!Array.isArray(logs)) return logs;

        // Crear array con todas las horas (0-23) inicializadas en 0
        const chartData: { hour: string, totalWh: number }[] = [];

        // Inicializar todas las horas del día con 0
        for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0') + ':00';
            chartData.push({ hour, totalWh: 0 });
        }

        // Agrupar logs por hora
        const grouped: Record<string, number> = {};
        logs.forEach(log => {
            const hour = log.startedAt.getHours().toString().padStart(2, '0') + ':00';
            grouped[hour] = (grouped[hour] || 0) + (log.totalWh || 0);
        });

        // Actualizar el chartData con los valores reales
        chartData.forEach(item => {
            if (grouped[item.hour]) {
                item.totalWh = grouped[item.hour];
            }
        });

        return chartData;
    }

    async getEnergyLog() {
        try {
            return await this.prisma.energyLog.findMany({
                include: {
                    areaDevice: true,
                }
            })
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async turnOn(areaDeviceId: number) {
        try {
            // Asegúrate de que no está ya encendido
            const active = await this.prisma.energyLog.findFirst({
                where: { areaDeviceId, endedAt: null },
            });

            if (active) return active;

            await this.prisma.energyLog.create({
                data: {
                    areaDeviceId,
                    startedAt: new Date(),
                },
            });

            baseResponse.message = 'Dispositivo apagado';
            return baseResponse;
        } catch (err) {
            badResponse.message = `Error al apagar ${err.message}`
            return badResponse;
        }
    }

    async turnOff(areaDeviceId: number) {
        try {
            const active = await this.prisma.energyLog.findFirst({
                where: {
                    areaDeviceId,
                    endedAt: null
                },
                orderBy: {
                    startedAt: 'desc'
                },
                include: {
                    areaDevice: {
                        include: {
                            device: true
                        }
                    }
                }
            })

            if (!active) return null;

            const durationHours = (new Date().getTime() - active.startedAt.getTime()) / (1000 * 60 * 60);
            const totalWh = active.areaDevice.device.powerWatts * durationHours;

            await this.prisma.energyLog.update({
                where: { id: active.id },
                data: {
                    endedAt: new Date(),
                    totalWh: totalWh
                }
            });

            baseResponse.message = 'Dispositivo apagado';
            return baseResponse;
        } catch (err) {
            badResponse.message = `Error al apagar ${err.message}`
            return badResponse;
        }
    }








    ///////////////////////////////////////////////


    async getEnergyLogChartDataByHour(
        startDate: Date,
        endDate: Date,
        filters?: EnergyLogFilters
    ): Promise<ApiResponse<HourlyEnergyData[]>> {
        try {
            const whereClause: any = {
                startedAt: {
                    gte: startDate,
                    lte: endDate,
                },
                totalWh: {
                    not: null, // Solo logs completados
                },
            };

            // Aplicar filtros adicionales
            if (filters?.areaIds?.length) {
                whereClause.areaDevice = {
                    areaId: { in: filters.areaIds }
                };
            }

            if (filters?.deviceTypes?.length) {
                whereClause.areaDevice = {
                    ...whereClause.areaDevice,
                    device: {
                        type: { in: filters.deviceTypes }
                    }
                };
            }

            const logs = await this.prisma.energyLog.findMany({
                where: whereClause,
                include: {
                    areaDevice: {
                        include: {
                            device: true,
                            area: true,
                        },
                    },
                },
                orderBy: {
                    startedAt: 'asc',
                },
            });

            // Agrupar por hora
            const hourlyData: Record<string, number> = {};

            logs.forEach(log => {
                if (log.totalWh) {
                    // Crear clave de hora: "YYYY-MM-DD HH:00"
                    const date = new Date(log.startedAt);
                    const hourKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;

                    hourlyData[hourKey] = (hourlyData[hourKey] || 0) + log.totalWh;
                }
            });

            // Convertir a array y ordenar
            const chartData: HourlyEnergyData[] = Object.entries(hourlyData)
                .map(([hour, totalWh]) => ({
                    hour,
                    totalWh: Number(totalWh.toFixed(2)),
                    date: hour.split(' ')[0], // Extraer solo la fecha
                    timestamp: new Date(hour.replace(' ', 'T') + ':00.000Z'),
                }))
                .sort((a, b) => a.hour.localeCompare(b.hour));

            return {
                success: true,
                data: chartData,
                message: `Datos obtenidos exitosamente: ${chartData.length} registros por hora`,
            };
        } catch (error) {
            console.error('Error al obtener datos por hora:', error);
            return {
                success: false,
                data: [],
                error: 'Error al obtener datos de consumo por hora',
            };
        }
    }

    // ===============================
    // OBTENER DATOS POR DÍA
    // ===============================

    async getEnergyLogChartDataByDay(
        startDate: Date,
        endDate: Date,
        filters?: EnergyLogFilters
    ): Promise<ApiResponse<DailyEnergyData[]>> {
        try {
            const whereClause: any = {
                startedAt: {
                    gte: startDate,
                    lte: endDate,
                },
                totalWh: {
                    not: null,
                },
            };

            if (filters?.areaIds?.length) {
                whereClause.areaDevice = {
                    areaId: { in: filters.areaIds }
                };
            }

            if (filters?.deviceTypes?.length) {
                whereClause.areaDevice = {
                    ...whereClause.areaDevice,
                    device: {
                        type: { in: filters.deviceTypes }
                    }
                };
            }

            const logs = await this.prisma.energyLog.findMany({
                where: whereClause,
                include: {
                    areaDevice: {
                        include: {
                            device: true,
                        },
                    },
                },
            });

            // Agrupar por día
            const dailyData: Record<string, { totalWh: number; deviceCount: Set<number> }> = {};

            logs.forEach(log => {
                if (log.totalWh) {
                    const dateKey = log.startedAt.toISOString().slice(0, 10); // YYYY-MM-DD

                    if (!dailyData[dateKey]) {
                        dailyData[dateKey] = { totalWh: 0, deviceCount: new Set() };
                    }

                    dailyData[dateKey].totalWh += log.totalWh;
                    dailyData[dateKey].deviceCount.add(log.areaDeviceId);
                }
            });

            // Convertir a array
            const chartData: DailyEnergyData[] = Object.entries(dailyData)
                .map(([date, data]) => ({
                    date,
                    totalWh: Number(data.totalWh.toFixed(2)),
                    deviceCount: data.deviceCount.size,
                }))
                .sort((a, b) => a.date.localeCompare(b.date));

            return {
                success: true,
                data: chartData,
                message: `Datos obtenidos exitosamente: ${chartData.length} días`,
            };
        } catch (error) {
            console.error('Error al obtener datos por día:', error);
            return {
                success: false,
                data: [],
                error: 'Error al obtener datos de consumo por día',
            };
        }
    }

    // ===============================
    // OBTENER DATOS POR ÁREA
    // ===============================

    async getEnergyLogChartByArea(startDate: Date, endDate: Date) {
        try {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            const logs = await this.prisma.energyLog.findMany({
                where: {
                    startedAt: {
                        gte: start,
                        lte: end,
                    },
                },
                include: {
                    areaDevice: {
                        include: {
                            area: true,
                        },
                    },
                },
            });

            // Agrupamos por nombre del área
            const grouped: Record<string, number> = {};

            logs.forEach(log => {
                const areaName = log.areaDevice?.area?.name ?? 'Área desconocida';
                grouped[areaName] = (grouped[areaName] || 0) + (log.totalWh || 0);
            });

            // Convertimos a formato de arreglo para frontend
            const chartData = Object.entries(grouped).map(([area, energy]) => ({
                area,
                energy,
            }));

            return chartData;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    // ===============================
    // OBTENER DATOS POR TIPO DE DISPOSITIVO
    // ===============================

    async getEnergyLogByDeviceType(
        startDate: Date,
        endDate: Date
    ): Promise<ApiResponse<DeviceTypeEnergyData[]>> {
        try {
            const logs = await this.prisma.energyLog.findMany({
                where: {
                    startedAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                    totalWh: {
                        not: null,
                    },
                },
                include: {
                    areaDevice: {
                        include: {
                            device: true,
                        },
                    },
                },
            });

            // Agrupar por tipo de dispositivo
            const deviceTypeData: Record<DeviceType, { totalWh: number; deviceCount: Set<number> }> = {
                [DeviceType.LIGHT]: { totalWh: 0, deviceCount: new Set() },
                [DeviceType.AC]: { totalWh: 0, deviceCount: new Set() },
            };

            logs.forEach(log => {
                if (log.totalWh && log.areaDevice?.device) {
                    const deviceType = log.areaDevice.device.type as DeviceType;
                    deviceTypeData[deviceType].totalWh += log.totalWh;
                    deviceTypeData[deviceType].deviceCount.add(log.areaDevice.device.id);
                }
            });

            // Convertir a array
            const chartData: DeviceTypeEnergyData[] = Object.entries(deviceTypeData)
                .map(([type, data]) => ({
                    deviceType: type as DeviceType,
                    deviceTypeName: type === DeviceType.LIGHT ? 'Luces' : 'Aire Acondicionado',
                    totalWh: Number(data.totalWh.toFixed(2)),
                    deviceCount: data.deviceCount.size,
                    averageWh: data.deviceCount.size > 0
                        ? Number((data.totalWh / data.deviceCount.size).toFixed(2))
                        : 0,
                }))
                .filter(item => item.totalWh > 0)
                .sort((a, b) => b.totalWh - a.totalWh);

            return {
                success: true,
                data: chartData,
                message: `Datos de ${chartData.length} tipos de dispositivo obtenidos exitosamente`,
            };
        } catch (error) {
            console.error('Error al obtener datos por tipo de dispositivo:', error);
            return {
                success: false,
                data: [],
                error: 'Error al obtener datos por tipo de dispositivo',
            };
        }
    }

    // ===============================
    // OBTENER ESTADÍSTICAS DEL DASHBOARD
    // ===============================

    async getDashboardStats(
        currentPeriodStart: Date,
        currentPeriodEnd: Date,
        previousPeriodStart: Date,
        previousPeriodEnd: Date
    ): Promise<ApiResponse<DashboardStats>> {
        try {
            // Obtener datos del período actual
            const [currentStats, previousStats, activeDevices, currentPeople] = await Promise.all([
                this.getStatsForPeriod(currentPeriodStart, currentPeriodEnd),
                this.getStatsForPeriod(previousPeriodStart, previousPeriodEnd),
                this.getActiveDevicesCount(),
                this.getCurrentPeopleCount(),
            ]);

            const calculateChange = (current: number, previous: number): number => {
                if (previous === 0) return current > 0 ? 100 : 0;
                return Number(((current - previous) / previous * 100).toFixed(1));
            };

            const dashboardStats: DashboardStats = {
                totalEnergy: currentStats.totalEnergy,
                totalEnergyChange: calculateChange(currentStats.totalEnergy, previousStats.totalEnergy),
                lightingEnergy: currentStats.lightingEnergy,
                lightingEnergyChange: calculateChange(currentStats.lightingEnergy, previousStats.lightingEnergy),
                acEnergy: currentStats.acEnergy,
                acEnergyChange: calculateChange(currentStats.acEnergy, previousStats.acEnergy),
                currentPeople,
                activeDevices,
            };

            return {
                success: true,
                data: dashboardStats,
                message: 'Estadísticas del dashboard obtenidas exitosamente',
            };
        } catch (error) {
            console.error('Error al obtener estadísticas del dashboard:', error);
            return {
                success: false,
                data: {} as DashboardStats,
                error: 'Error al obtener estadísticas del dashboard',
            };
        }
    }

    // ===============================
    // MÉTODOS AUXILIARES PRIVADOS
    // ===============================

    private async getStatsForPeriod(startDate: Date, endDate: Date) {
        const logs = await this.prisma.energyLog.findMany({
            where: {
                startedAt: {
                    gte: startDate,
                    lte: endDate,
                },
                totalWh: {
                    not: null,
                },
            },
            include: {
                areaDevice: {
                    include: {
                        device: true,
                    },
                },
            },
        });

        let totalEnergy = 0;
        let lightingEnergy = 0;
        let acEnergy = 0;

        logs.forEach(log => {
            if (log.totalWh && log.areaDevice?.device) {
                const energy = log.totalWh / 1000; // Convertir de Wh a kWh
                totalEnergy += energy;

                if (log.areaDevice.device.type === DeviceType.LIGHT) {
                    lightingEnergy += energy;
                } else if (log.areaDevice.device.type === DeviceType.AC) {
                    acEnergy += energy;
                }
            }
        });

        return {
            totalEnergy: Number(totalEnergy.toFixed(2)),
            lightingEnergy: Number(lightingEnergy.toFixed(2)),
            acEnergy: Number(acEnergy.toFixed(2)),
        };
    }

    private async getActiveDevicesCount(): Promise<number> {
        const activeDevices = await this.prisma.areaDevice.count({
            where: {
                isOn: true,
            },
        });

        return activeDevices;
    }

    private async getCurrentPeopleCount(): Promise<number> {
        // Contar personas que han entrado pero no han salido
        const entries = await this.prisma.accessLog.groupBy({
            by: ['userId'],
            where: {
                type: 'ENTRY',
            },
            _max: {
                timestamp: true,
            },
        });

        const exits = await this.prisma.accessLog.groupBy({
            by: ['userId'],
            where: {
                type: 'EXIT',
            },
            _max: {
                timestamp: true,
            },
        });

        let currentPeople = 0;

        entries.forEach(entry => {
            const userExit = exits.find(exit => exit.userId === entry.userId);

            if (!userExit || (entry._max.timestamp && userExit._max.timestamp && entry._max.timestamp > userExit._max.timestamp)) {
                currentPeople++;
            }
        });

        return currentPeople;
    }

    async generateConsumptionReport(type: 'LIGHT' | 'AC' | 'ACCESS', date: Date, res: Response) {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Reporte de Consumo');

        // Encabezado común
        sheet.columns = [
            { header: 'Área', key: 'area', width: 25 },
            { header: 'Valor', key: 'value', width: 15 },
            { header: 'Unidad', key: 'unit', width: 10 },
            { header: 'Hora', key: 'time', width: 10 },
            { header: 'Fecha', key: 'date', width: 15 },
        ];

        // Aquí se define qué datos usar según el tipo
        let data: Array<any> = [];

        const parsedDate = new Date(date);
        parsedDate.setHours(0, 0, 0, 0);
        const endDate = new Date(parsedDate);
        endDate.setHours(23, 59, 59, 999);

        if (type === 'LIGHT' || type == 'AC') {
            data = await this.getEnergyLogForExcel(type, parsedDate, endDate);
        } 


        for (const entry of data) {
            sheet.addRow({
                date: entry.date,
                time: entry.time,
                area: entry.area,
                value: entry.value,
                unit: entry.unit,
            });
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=clientes.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    }

    // Ejemplo de función para obtener los logs de energía
    async getEnergyLogForExcel(type: 'LIGHT' | 'AC', start: Date, end: Date) {
        const logs = await this.prisma.energyLog.findMany({
            where: {
                startedAt: { gte: start, lte: end },
            },
            include: {
                areaDevice: {
                    include: {
                        area: true,
                        device: true
                    },
                },
            },
        });

        return logs.filter(item => item.areaDevice.device.type === type).map(log => ({
            date: log.startedAt.toISOString().split('T')[0],
            time: log.startedAt.toISOString().split('T')[1].slice(0, 5),
            area: log.areaDevice.area.name,
            value: log.totalWh,
            unit: 'Wh',
        }));
    }

}

