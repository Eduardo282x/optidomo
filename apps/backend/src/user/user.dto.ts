import { IsEmail, IsEnum, IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export enum Role {
    ADMIN = 'ADMIN',
    TEACHER = 'TEACHER',
    STUDENT = 'STUDENT',
}

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsEmail()
    email: string;

    @IsEnum(Role)
    role: Role;

    @IsBoolean()
    @IsOptional()
    isPaid?: boolean;
}
