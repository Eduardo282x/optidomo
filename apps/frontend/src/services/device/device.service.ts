import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "../api";
import { DeviceBody } from "./device.interface";

const deviceURL = '/device';

export const getDevices = async () => {
    try {
        return await getDataApi(deviceURL);
    } catch (err) {
        return err;
    }
}

export const createdDevice = async (data: DeviceBody) => {
    try {
        return await postDataApi(deviceURL, data);
    } catch (err) {
        return err;
    }
}
export const updatedDevice = async (id: number, data: DeviceBody) => {
    try {
        return await putDataApi(`${deviceURL}/${id}`, data);
    } catch (err) {
        return err;
    }
}
export const deletedDevice = async (id: number) => {
    try {
        return await deleteDataApi(`${deviceURL}/${id}`);
    } catch (err) {
        return err;
    }
}