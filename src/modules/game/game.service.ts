import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GameApi } from "./game.api";
import { Game } from "@prisma/client";
import { GameDetailsDTO, GameSummaryDTO, SearchGameDTO, toGameDetailsDTO, toGameSummaryDTO } from "./game.dtos";

@Injectable()
export class GameService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly gameApi: GameApi
    ) { }

    async avrageRating(gameId: string): Promise<number> {
        return await this.prismaService.review.aggregate({
            where: { gameId },
            _avg: { rating: true },
        }).then(res => res._avg.rating?.toNumber() ?? 0);
    }

    async getAllGames(): Promise<GameSummaryDTO[]> {
        const games: Game[] = await this.prismaService.game.findMany()
        return games.map(g => toGameSummaryDTO(g.id, g.gameData));
    }

    async fetchGameInRawg(apiId: number): Promise<GameDetailsDTO> {
        const game = await this.prismaService.game.findFirst({
            where: { apiId: apiId.toString() },
        });

        if (game)
            return toGameDetailsDTO(game.id, game.gameData, await this.avrageRating(game.id));

        const apiResponse = await this.gameApi.fetchById(apiId);
        return await this.prismaService.game.create({
            data: {
                apiId: apiResponse.data.id.toString(),
                title: apiResponse.data.name,
                gameData: apiResponse.data
            }
        }).then(async createdGame => toGameDetailsDTO(createdGame.id, createdGame.gameData, await this.avrageRating(createdGame.id)));
    }

    async fetchGameDetails(gameId: string): Promise<GameDetailsDTO> {
        return this.prismaService.game.findUnique({
        where: { id: gameId },
        }).then(async game => toGameDetailsDTO(game?.id || '', game?.gameData, await this.avrageRating(gameId)));
    }


    async searchGames(query: SearchGameDTO): Promise<any[]> {
        const apiResponse = await this.gameApi.fetchSearch(query);
        return apiResponse.data.results
            .map((gameData: any) => toGameSummaryDTO('', gameData));
    }

    async mostReviewedGames(): Promise<GameSummaryDTO[]> {
        return await this.prismaService.game.findMany({
            include: {
                _count: { select: { Reviews: true } },
            },
            orderBy: { Reviews: { _count: 'desc' } },
            take: 10,
        }).then(games => games.map(g => toGameSummaryDTO(g.id, g.gameData)));
    }

    async bestRatedGames(): Promise<GameSummaryDTO[]> {
        const topRated = await this.prismaService.review.groupBy({
            by: ['gameId'],
            _avg: { rating: true },
            orderBy: { _avg: { rating: 'desc' } },
            take: 10,
        });

        const gameIds = topRated.map(r => r.gameId);

        const games = await this.prismaService.game.findMany({
            where: { id: { in: gameIds } },
        });

        return games.map(g => toGameSummaryDTO(
            g.id,
            g.gameData,
            topRated.find(t => t.gameId === g.id)?._avg.rating?.toNumber() ?? 0
       ));
    }
}
