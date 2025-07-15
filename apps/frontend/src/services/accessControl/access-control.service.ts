import { getDataApi, postDataApi } from "../api";
import { AccessLogBody } from "./access-control.interface";

const accessLogURL = '/access-log';

export const getAccessLog = async () => {
    try {
        return await getDataApi(accessLogURL);
    } catch (err) {
        return err;
    }
}

export const saveAccessLog = async (data: AccessLogBody) => {
    try {
        return await postDataApi(accessLogURL, data);
    } catch (err) {
        return err;
    }
}
