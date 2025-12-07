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
        return games.map(g => toGameSummaryDTO(g.gameData));
    }

    async fetchGameDetails(gameId: string): Promise<GameDetailsDTO> {
        const game = await this.prismaService.game.findFirst({
            where: { id: gameId },
        });

        if (game)
            return toGameDetailsDTO(game.gameData, await this.avrageRating(game.id));

        const apiResponse = await this.gameApi.fetchById(gameId);
        return await this.prismaService.game.create({
            data: {
                id: apiResponse.data.id.toString() as string,
                title: apiResponse.data.name as string,
                gameData: apiResponse.data as any,
            }
        }).then(async createdGame => toGameDetailsDTO(createdGame.gameData, await this.avrageRating(createdGame.id)));
    }

    async searchGames(query: SearchGameDTO): Promise<any[]> {
        const apiResponse = await this.gameApi.fetchSearch(query);
        return apiResponse.data.results
            .map((gameData: any) => toGameSummaryDTO(gameData));
    }

    async popularGames(quantity: number): Promise<GameSummaryDTO[]> {
        const apiResponse = await this.gameApi.fetchGameList({
            query: '-metacritic',
            page: 1,
            pageSize: quantity,
        });

        return apiResponse.data.results
            .map((gameData: any) => toGameSummaryDTO(gameData));
    }

    async mostReviewedGames(quantity: number): Promise<GameSummaryDTO[]> {
        return await this.prismaService.game.findMany({
            include: {
                _count: { select: { Reviews: true } },
            },
            orderBy: { Reviews: { _count: 'desc' } },
            take: quantity,
        }).then(games => games.map(g => toGameSummaryDTO(g.gameData)));
    }

    async bestRatedGames(quantity: number): Promise<GameSummaryDTO[]> {
        const topRated = await this.prismaService.review.groupBy({
            by: ['gameId'],
            _avg: { rating: true },
            orderBy: { _avg: { rating: 'desc' } },
            take: quantity,
        });

        const gameIds = topRated.map(r => r.gameId);

        const games = await this.prismaService.game.findMany({
            where: { id: { in: gameIds } },
        });

        return games.map(g =>
            toGameSummaryDTO(
                g.gameData,
                topRated.find(t => t.gameId === g.id)?._avg.rating?.toNumber() ?? 0
            )
        );
    }
}
