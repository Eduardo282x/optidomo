import { IsNotEmpty, IsNumber, IsString, } from 'class-validator';

export class AssignDeviceDto {
    @IsString()
    @IsNotEmpty({ message: 'Este campo es requerido.' })
    name: string;
    @IsNumber()
    @IsNotEmpty({ message: 'Este campo es requerido.' })
    areaId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'Este campo es requerido.' })
    deviceId: number;
}
