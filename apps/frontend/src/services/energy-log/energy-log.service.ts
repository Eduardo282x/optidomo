import { getDataApi, postDataApi, postDataFileApi } from "../api";
import { ReportBody, TurnOnDeviceBody, TurnOffDeviceBody } from "./energy-log.interface";

const energyLogURL = '/energy-log';

export const getEnergyLog = async () => {
    try {
        return await getDataApi(energyLogURL);
    } catch (err) {
        return err;
    }
}

export const getEnergyLogChartDataToday = async () => {
    try {
        return await getDataApi(`${energyLogURL}/energy-log/today`);
    } catch (err) {
        return err;
    }
}
export const getEnergyLogByDay = async (date: string) => {
    try {
        return await getDataApi(`${energyLogURL}/energy-log/day?date=${date}`);
    } catch (err) {
        return err;
    }
}

export const generateReport = async (data: ReportBody) => {
    try {
        return await postDataFileApi(`${energyLogURL}/report`, data);
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
