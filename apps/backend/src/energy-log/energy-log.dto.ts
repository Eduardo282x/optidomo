import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class ToggleEnergyLog {
    @IsNumber()
    @IsNotEmpty()
    areaDeviceId: number;
}

export class BodyReportDTO {
    @IsString()
    type: 'LIGHT' | 'AC' | 'ACCESS';

    @IsDate()
    @Transform(({ value }) => new Date(value))
    date: Date;
}


export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
    timestamp?: Date;
}

export interface DateRange {
    startDate: Date;
    endDate: Date;
}

// Para filtros de búsqueda
export interface EnergyLogFilters {
    dateRange?: DateRange;
    areaIds?: number[];
    deviceTypes?: 'LIGHT' | 'AC'[];
    includeActiveDevices?: boolean; // Incluir dispositivos actualmente encendidos
}

// Para agregaciones de datos
export interface EnergyAggregation {
    groupBy: 'hour' | 'day' | 'week' | 'month' | 'area' | 'deviceType';
    dateRange: DateRange;
    filters?: EnergyLogFilters;
}

export interface HourlyEnergyData {
    hour: string; // Formato: "HH:MM" o "yyyy-mm-dd HH:MM"
    totalWh: number; // Total de watts-hora consumidos en esa hora
    date?: string; // Formato: "yyyy-mm-dd" (opcional para filtros)
    timestamp?: Date; // Timestamp completo (opcional)
}

export interface DailyEnergyData {
    date: string; // Formato: "yyyy-mm-dd"
    totalWh: number; // Total de watts-hora consumidos en ese día
    deviceCount?: number; // Cantidad de dispositivos activos (opcional)
}

export interface AreaEnergyData {
    areaId: number;
    areaName: string;
    totalWh: number; // Consumo total del área
    deviceCount: number; // Cantidad de dispositivos en el área
    averageWh?: number; // Promedio por dispositivo (opcional)
}

export interface AreaEnergyData {
    areaId: number;
    areaName: string;
    totalWh: number; // Consumo total del área
    deviceCount: number; // Cantidad de dispositivos en el área
    averageWh?: number; // Promedio por dispositivo (opcional)
}

export interface DeviceTypeEnergyData {
    deviceType: 'LIGHT' | 'AC';
    deviceTypeName: string; // "Luces" | "Aire Acondicionado"
    totalWh: number;
    deviceCount: number;
    averageWh: number;
}


export interface DashboardStats {
    totalEnergy: number; // Total de energía consumida (kWh)
    totalEnergyChange: number; // Cambio porcentual desde el período anterior
    lightingEnergy: number; // Energía consumida por luces
    lightingEnergyChange: number;
    acEnergy: number; // Energía consumida por AC
    acEnergyChange: number;
    currentPeople: number; // Personas actuales en el edificio
    activeDevices: number; // Dispositivos actualmente encendidos
}