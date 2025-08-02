export interface UserBody {
    fullName: string;
    email: string;
    role: Role;
    isPaid?: boolean;
}

export interface IUser {
    id: number,
    fullName: string;
    email: string;
    isPaid: boolean;
    password: string;
    role: Role;
    createdAt: Date;
}

export interface GroupUser {
    allUsers: IUser[];
    users: IUser[]
}

export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | ''