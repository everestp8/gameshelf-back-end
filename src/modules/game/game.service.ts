import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GameApi } from "./game.api";
import { Game } from "@prisma/client";
import { SearchGameDTO } from "./game.dtos";

@Injectable()
export class GameService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly gameApi: GameApi
    ) {}

    async getAllGames(): Promise<Game[]> {
        return await this.prismaService.game.findMany()
    }

    async getGameById(gameId: number): Promise<Game> {
        const game = await this.prismaService.game.findFirst({
            where: { apiId: gameId.toString() },
        });

        if (game)
            return game;

        const apiResponse = await this.gameApi.fetchById(gameId);
        return await this.prismaService.game.create({
            data: {
                apiId: apiResponse.data.id.toString(),
                title: apiResponse.data.name,
                gameData: apiResponse.data
            }
        })
    }

    async searchGames(query: SearchGameDTO): Promise<any[]> {
        const apiResponse = await this.gameApi.fetchSearch(query);
        return apiResponse.data.results;
    }
}
