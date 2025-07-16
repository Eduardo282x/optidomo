import { getDataApi, postDataApi } from "../api";
import { TurnOnDeviceBody, TurnOffDeviceBody } from "./energy-log.interface";

const energyLogURL = '/energy-log';

export const getEnergyLog = async () => {
    try {
        return await getDataApi(energyLogURL);
    } catch (err) {
        return err;
    }
}

export const turnOnDevice = async (data: TurnOnDeviceBody) => {
    try {
        return await postDataApi(`${energyLogURL}/turn-on`, data);
    } catch (err) {
        return err;
    }
}
export const turnOfFDevice = async (data: TurnOffDeviceBody) => {
    try {
        return await postDataApi(`${energyLogURL}/turn-off`, data);
    } catch (err) {
        return err;
    }
}
