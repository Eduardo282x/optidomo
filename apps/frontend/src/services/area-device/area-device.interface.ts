import { IArea } from "../area/area.interface";
import { IDevice } from "../device/device.interface";

export interface IAreaDevice extends AreaDeviceBody {
    id: number;
    isOn: boolean;
    device: IDevice;
    area: IArea
}

export interface GroupAreaDevices {
    allAreaDevices: IAreaDevice[],
    areaDevices: IAreaDevice[]
}

export interface AreaDeviceBody {
    name: string;
    areaId: number
    deviceId: number
}

