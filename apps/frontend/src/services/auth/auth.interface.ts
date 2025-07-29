export interface UserBody {
    fullName: string;
    email: string;
    role: Role;
}

export interface IUser {
    id: number,
    fullName: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
}

export interface GroupUser {
    allUsers: IUser[];
    users: IUser[]
}

export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | ''