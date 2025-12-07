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
        // 1. Tenta buscar no cache (Prisma)
        const cachedGames = await this.prismaService.game.findMany({
            take: 30,
        });

        if (cachedGames.length > 0) {
            return cachedGames;
        }

        // 2. Se o cache estiver vazio, busca na RAWG (Lista de Populares)
        try {
            // Usamos o fetchSearch com um termo vazio, que a API RAWG trata como
            // a listagem dos jogos mais populares ou recentes.
            const defaultQuery: SearchGameDTO = { query: '', page: 1, pageSize: 30 };

            // Não há autenticação na rota '/games' no controller, 
            // então não precisa de token aqui.
            const apiResponse = await this.gameApi.fetchSearch(defaultQuery);
            const rawgResults = apiResponse.data.results;

            if (rawgResults.length === 0) {
                return [];
            }

            // 3. Salva os resultados no cache (Prisma)
            const gamesToCreate = rawgResults.map(rawgGame => ({
                apiId: rawgGame.id.toString(),
                title: rawgGame.name,
                gameData: rawgGame, // Salva o JSON completo
            }));

            // Insere os jogos no banco de dados
            await this.prismaService.game.createMany({
                data: gamesToCreate,
                skipDuplicates: true
            });

            // 4. Retorna a lista completa recém-criada
            return await this.prismaService.game.findMany({ take: 30 });

        } catch (error) {
            // Se houver erro na API RAWG (ex: chave inválida), registra e retorna vazio.
            console.error("Erro ao buscar jogos na RAWG:", error);
            return [];
        }
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
