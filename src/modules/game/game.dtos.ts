import { Game } from "@prisma/client";
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

export interface GameDetailsDTO {
    id: string;
    apiId: number;
    title: string;
    tags: string[];
    playtimeHours: number;
    releaseDate: string;
    developers: string[];
    description: string;
    backgroundImage: string;
    backgroundImageAdditional: string;
    rating: number;
}

export interface GameSummaryDTO {
    id: string;
    apiId: number;
    title: string;
    backgroundImage: string;
    rating?: number;
}

export function toGameSummaryDTO(gameId: string, gameData: any, avgRating?: number): GameSummaryDTO {
    return {
        id: gameId,
        apiId: gameData?.id,
        title: gameData?.name || '',
        backgroundImage: gameData?.background_image || '',
        rating: avgRating
    };
}

export function toGameDetailsDTO(gameId: string, gameData: any, rating: number): GameDetailsDTO {
    return {
        id: gameId,
        apiId: gameData.id,
        title: gameData.name,
        tags: gameData.tags ? gameData.tags.map((tag: any) => tag.name) : [],
        playtimeHours: gameData.playtime || 0,
        releaseDate: gameData.released || '',
        developers: gameData.developers ? gameData.developers.map((dev: any) => dev.name) : [],
        description: gameData.description_raw || '',
        backgroundImage: gameData.background_image || '',
        backgroundImageAdditional: gameData.background_image_additional || '',
        rating: rating
    };
}

