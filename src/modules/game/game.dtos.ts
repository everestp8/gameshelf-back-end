import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SearchGameDTO {
    @IsString()
    @IsNotEmpty()
    query: string;
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    page: number = 1;
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    pageSize: number = 10;
}

