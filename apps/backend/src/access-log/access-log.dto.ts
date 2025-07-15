import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export enum AccessType {
    ENTRY = 'ENTRY',
    EXIT = 'EXIT',
}
export class LogAccessDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    areaId: number;

    @IsEnum(AccessType)
    type: AccessType;
}
