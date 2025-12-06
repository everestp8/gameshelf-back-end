import { Injectable} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDTO, fromCreateUserDTO, fromUpdateUserDTO, ReadUserDTO, toReadUserDTO, UpdateUserDTO } from './user.dtos';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<ReadUserDTO[]> {
        return this.prisma.user.findMany()
            .then(users => users.map(user => toReadUserDTO(user)));
    }

    async findById(id: string): Promise<ReadUserDTO | null> {
        return this.prisma.user.findUnique({
            where: { id },
        }).then(user => user ? toReadUserDTO(user) : null);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        })
    }

    async deleteById(id: string): Promise<ReadUserDTO> {
        return this.prisma.user.delete({
            where: { id },
        }).then(user => toReadUserDTO(user));
    }

    async updateUser(id: string, data: UpdateUserDTO): Promise<ReadUserDTO> {
        return this.prisma.user.update({
            where: { id },
            data: fromUpdateUserDTO(data),
        }).then(user => toReadUserDTO(user));
    }

    async createUser(data: CreateUserDTO): Promise<User> {
        return this.prisma.user.create({ data: fromCreateUserDTO(data) });
    }
}

