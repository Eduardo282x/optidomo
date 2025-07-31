import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsEmail({}, {message: 'Debe ingresar un correo electrónico valido'})
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
