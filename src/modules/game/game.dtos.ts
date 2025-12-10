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
    title: string;
    tags: string[];
    playtimeHours: number;
    metacritic?: number;
    releaseDate: string;
    developers: string[];
    plataforms: string[];
    description: string;
    backgroundImage: string;
    backgroundImageAdditional: string;
    rating: number;
}

export interface GameSummaryDTO {
    id: string;
    title: string;
    backgroundImage: string;
    metacritic?: number;
    rating?: number;
}

export function toGameSummaryDTO(gameData: any, avgRating?: number): GameSummaryDTO {
    return {
        id: gameData?.id.toString() || '',
        title: gameData?.name || '',
        backgroundImage: gameData?.background_image || '',
        metacritic: gameData?.metacritic || undefined,
        rating: avgRating
    };
}

export function toGameDetailsDTO(gameData: any, rating: number): GameDetailsDTO {
    return {
        id: gameData.id.toString() || '',
        title: gameData.name,
        tags: gameData.tags ? gameData.tags.map((tag: any) => tag.name) : [],
        playtimeHours: gameData.playtime || 0,
        metacritic: gameData.metacritic || undefined,
        releaseDate: gameData.released || '',
        developers: gameData.developers ? gameData.developers.map((dev: any) => dev.name) : [],
        plataforms: gameData.platforms ? gameData.platforms.map((plat: any) => plat.platform.name) : [],
        description: gameData.description_raw || '',
        backgroundImage: gameData.background_image || '',
        backgroundImageAdditional: gameData.background_image_additional || '',
        rating: rating
    };
}

