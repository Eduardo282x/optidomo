export interface DeviceBody {
    name: string;
    type: TypeDevice;
    powerWatts: number;
}

export interface GroupDevices {
    allDevices: IDevice[],
    devices: IDevice[]
}

export interface IDevice {
    id: number;
    name: string;
    type: TypeDevice;
    powerWatts: number;
}

export type TypeDevice = 'LIGHT' | 'AC' | '' | 'all';