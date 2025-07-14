export interface UserBody {
    username: string;
    name: string;
    lastName: string;
    role: Role;
}

export interface IUser {
    id: number,
    name: string;
    lastName: string;
    username: string;
    role: Role;
}

export interface GroupUser {
    allUsers: IUser[];
    users: IUser[]
}

export type Role = 'ADMIN' | 'GERENTE' | 'RECEPCIONISTA'