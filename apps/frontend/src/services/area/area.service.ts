import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "../api";
import { AreaBody } from "./area.interface";

const areaURL = '/area';

export const getAreas = async () => {
    try {
        return await getDataApi(areaURL);
    } catch (err) {
        return err;
    }
}

export const createdArea = async (data: AreaBody) => {
    try {
        return await postDataApi(areaURL, data);
    } catch (err) {
        return err;
    }
}
export const updatedArea = async (id: number, data: AreaBody) => {
    try {
        return await putDataApi(`${areaURL}/${id}`, data);
    } catch (err) {
        return err;
    }
}
export const deletedArea = async (id: number) => {
    try {
        return await deleteDataApi(`${areaURL}/${id}`);
    } catch (err) {
        return err;
    }
}