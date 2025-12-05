import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "@prisma/client";
import type { CreateUserDTO } from "./user.dtos";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/')
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get('/:id')
    findById(
        @Param ('id') id: string
    ): Promise<User | null> {
        return this.userService.findById(id);
    }
    deleteById(
        @Param('id') id: string
    ): Promise<User> {
        return this.userService.deleteById(id);
    }

    @Put('/:id')
    updateUser(
        @Param('id') id: string,
        @Body() data: { name?: string; email?: string }
    ): Promise<User> {
        return this.userService.updateUser(id, data);
    }

    @Post('/')
    create(
        @Body() data: CreateUserDTO
    ): Promise<User> {
        return this.userService.createUser(data);
    }
}

