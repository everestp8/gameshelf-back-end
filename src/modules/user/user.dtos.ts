export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export interface ReadUserDTO {
    id: string;
    name: string;
    email: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
}

