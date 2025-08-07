import { IArea } from "../area/area.interface";
import { IDevice } from "../device/device.interface";

export interface ReportBody {
    type: 'LIGHT' | 'AC' | 'ACCESS';
    date: Date;
}

export interface TurnOnDeviceBody {
    deviceId: number;
    areaId: number;
}


export interface TurnOffDeviceBody {
    deviceId: number;
}

export interface IEnergyLog {
    id: number;
    device: IDevice;
    deviceId: number;
    area: IArea;
    areaId: number;
    status: boolean;
    startedAt: Date;
    endedAt: Date | null;
    totalWh: number;
}