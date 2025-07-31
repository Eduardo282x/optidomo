import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "../api";
import { AreaDeviceBody } from "./area-device.interface";

const areaDeviceURL = '/area-device';

export const getAreaDevices = async () => {
    try {
        return await getDataApi(areaDeviceURL);
    } catch (err) {
        return err;
    }
}

export const createdAreaDevices = async (data: AreaDeviceBody) => {
    try {
        return await postDataApi(areaDeviceURL, data);
    } catch (err) {
        return err;
    }
}
export const toggleStatusDevicesByArea = async (areaId: number, type: 'AC' | 'LIGHT', status: boolean) => {
    try {
        return await putDataApi(`${areaDeviceURL}/toggleByArea?areaId=${areaId}&type=${type}&status=${status}`, {});
    } catch (err) {
        return err;
    }
}
export const toggleAllStatusDevices = async (type: 'AC' | 'LIGHT', status: boolean) => {
    try {
        return await putDataApi(`${areaDeviceURL}/toggle?type=${type}&status=${status}`, {});
    } catch (err) {
        return err;
    }
}
export const toggleStatusDevice = async (id: number) => {
    try {
        return await putDataApi(`${areaDeviceURL}/toggle/${id}`, {});
    } catch (err) {
        return err;
    }
}
export const updatedAreaDevices = async (id: number, data: AreaDeviceBody) => {
    try {
        return await putDataApi(`${areaDeviceURL}/${id}`, data);
    } catch (err) {
        return err;
    }
}
export const deletedAreaDevices = async (id: number) => {
    try {
        return await deleteDataApi(`${areaDeviceURL}/${id}`);
    } catch (err) {
        return err;
    }
}