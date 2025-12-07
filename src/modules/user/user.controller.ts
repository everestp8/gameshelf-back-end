import { Body, Controller, Delete, Get, Param, Post, Put, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO, type ReadUserDTO, UpdateUserDTO } from "./user.dtos";
import { Public } from "../auth/auth.guard";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Public()
    @Get('/')
    findAll(): Promise<ReadUserDTO[]> {
        return this.userService.findAll();
    }

    @Get('/profile/me')
    findById(
        @Req() req: { user: { sub: string } }
    ): Promise<ReadUserDTO | null> {
        return this.userService.findById(req.user.sub);
    }
    
    @Delete('/me')
    deleteById(
        @Req() req: { user: { sub: string } }
    ): Promise<ReadUserDTO> {
        return this.userService.deleteById(req.user.sub);
    }

    @Put('/me')
    updateUser(
        @Req() req: { user: { sub: string } },
        @Body() data: UpdateUserDTO
    ): Promise<ReadUserDTO> {
        return this.userService.updateUser(req.user.sub, data);
    }

    @Public()
    @Post('/')
    create(
        @Body() data: CreateUserDTO
    ): Promise<ReadUserDTO> {
        return this.userService.createUser(data);
    }
}

