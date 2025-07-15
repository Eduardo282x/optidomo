import { IArea } from "../area/area.interface";
import { IUser } from "../user/user.interface";

export interface IAccessLog {
    id: number;
    areaId: number;
    area: IArea
    userId: number;
    user: IUser;
    timestamp: Date;
    type: TypeAccess;
}

export interface AccessLogBody {
    userId: number;
    areaId: number;
    type: TypeAccess
}

export type TypeAccess = 'ENTRY' | 'EXIT' | ''