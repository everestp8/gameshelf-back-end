import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { createHash } from 'node:crypto';
import { CreateUserDTO, ReadUserDTO } from './user.dtos';

const hashPassword = (password: string): string =>
    createHash('sha256').update(password).digest('hex');

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async deleteById(id: string): Promise<User> {
        return this.prisma.user.delete({
            where: { id },
        });
    }

    async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async createUser(data: CreateUserDTO): Promise<User> {
        const hash = hashPassword(data.password);
        return this.prisma.user.create({ data: { name: data.name, email: data.email, password_hash: hash } });
    }
}

