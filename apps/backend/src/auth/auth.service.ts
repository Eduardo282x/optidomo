import { Injectable, UnauthorizedException } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email, password } });
        if (!user) {
            badResponse.message = 'Usuario no encontrado.'
            return badResponse;
        }

        // Solo admin y teacher pueden iniciar sesión
        if (user.role === 'STUDENT') {
            badResponse.message = 'Acceso denegado.'
            return badResponse;
        }


        baseResponse.data = user;
        baseResponse.message = `Bienvenido ${user.fullName}.`;

        return baseResponse;
    }
}
