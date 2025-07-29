import { ILogin } from "@/pages/auth/Login";
import { postDataApi } from "../api";

const authURL = '/auth';

export const loginAPI = async (data: ILogin) => {
    try {
        return await postDataApi(`${authURL}/login`, data);
    } catch (err) {
        return err;
    }
}