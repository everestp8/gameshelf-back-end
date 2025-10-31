import { Controller, Get } from "@nestjs/common";

@Controller('users')
export class UserController {
    @Get('/')
    findAll() {
        return 'hello world!'
    }
}