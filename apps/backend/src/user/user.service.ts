import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse } from 'src/base/base.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {

    constructor(private readonly prismaService: PrismaService) {

    }

    async getUsers() {
        return await this.prismaService.user.findMany({
            orderBy: { id: 'asc' }
        });
    }
    async getUsersSystem() {
        return await this.prismaService.user.findMany({
            where: { role: { not: 'STUDENT' } },
            orderBy: { id: 'asc' }
        });
    }
    async getStudents() {
        return await this.prismaService.user.findMany({
            where: { role: 'STUDENT' },
            orderBy: { id: 'asc' }
        });
    }

    async createUser(user: CreateUserDto) {
        try {
            await this.prismaService.user.create({
                data: {
                    fullName: user.fullName,
                    email: user.email,
                    password: '1234',
                    role: user.role,
                }
            });

            baseResponse.message = 'Usuario registrado.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
    async updateUser(id: number, user: CreateUserDto) {
        try {
            await this.prismaService.user.update({
                data: {
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    isPaid: user.isPaid
                },
                where: { id }
            });

            baseResponse.message = 'Usuario modificado.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
    async deleteUser(id: number) {
        try {
            await this.prismaService.user.delete({
                where: { id }
            });

            baseResponse.message = 'Usuario eliminado.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
}
