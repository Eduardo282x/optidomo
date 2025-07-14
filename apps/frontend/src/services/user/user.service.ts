import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "../api";
import { UserBody } from "./user.interface";

const userURL = '/users';

export const getUsers = async () => {
    try {
        return await getDataApi(userURL);
    } catch (err) {
        return err;
    }
}

export const createUser = async (data: UserBody) => {
    try {
        return await postDataApi(userURL, data);
    } catch (err) {
        return err;
    }
}
export const updateUser = async (id: number, data: UserBody) => {
    try {
        return await putDataApi(`${userURL}/${id}`, data);
    } catch (err) {
        return err;
    }
}
export const deleteUser = async (id: number) => {
    try {
        return await deleteDataApi(`${userURL}/${id}`);
    } catch (err) {
        return err;
    }
}