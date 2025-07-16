import { IsNotEmpty, IsNumber } from 'class-validator';
export class ToggleEnergyLog {
    @IsNumber()
    @IsNotEmpty()
    areaDeviceId: number;
}
