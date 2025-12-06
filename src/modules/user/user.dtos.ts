import { Prisma, User } from "@prisma/client";
import { hashPassword } from "./user.utils";

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export function fromCreateUserDTO(dto: CreateUserDTO): Prisma.UserCreateInput {
    return {
        name: dto.name,
        email: dto.email,
        password_hash: hashPassword(dto.password)
    }
}

export interface ReadUserDTO {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export function toReadUserDTO(user: User): ReadUserDTO {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
}

export function fromUpdateUserDTO(dto: UpdateUserDTO): Prisma.UserUpdateInput {
    const data: Prisma.UserUpdateInput = {};
    if (dto.name !== undefined)
        data.name = dto.name;
    if (dto.email !== undefined)
        data.email = dto.email;
    if (dto.password !== undefined)
        data.password_hash = hashPassword(dto.password);
    return data;
}

