import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {

    }

    @Get()
    async getUsers() {
        return await this.userService.getUsers();
    }
    @Get('/normal')
    async getUsersSystem() {
        return await this.userService.getUsersSystem();
    }
    @Get('/students')
    async getStudents() {
        return await this.userService.getStudents();
    }
    @Post()
    async createUser(@Body() user: CreateUserDto) {
        return await this.userService.createUser(user);
    }
    @Put('/:id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: CreateUserDto) {
        return await this.userService.updateUser(id, user);
    }
    @Delete('/:id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.deleteUser(id);
    }
}
