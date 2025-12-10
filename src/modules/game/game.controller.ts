import { Controller, Get, Param, Query } from "@nestjs/common";
import { GameService } from "./game.service";
import { Public } from "../auth/auth.guard";
import { GameDetailsDTO, GameSummaryDTO, SearchGameDTO } from "./game.dtos";

@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Public()
    @Get('/')
    async getAllGames(
        @Query() queries: { ranking: string, quantity?: string }
    ): Promise<GameSummaryDTO[]> {
        const quantity: number = parseInt(queries.quantity || '10')
        if (queries.ranking === 'most-reviewed')
            return await this.gameService.mostReviewedGames(quantity);
        if (queries.ranking === 'best-rated')
            return await this.gameService.bestRatedGames(quantity);
        if (queries.ranking === 'popular')
            return await this.gameService.popularGames(quantity);

        return await this.gameService.getAllGames();
    }

    @Get('/details/:id')
    async getGameDetails(
        @Param('id') id: string
    ): Promise<GameDetailsDTO> {
        return await this.gameService.fetchGameDetails(id);
    }

    @Public()
    @Get('/search')
    async searchGames(
        @Query() queries: SearchGameDTO 
    ): Promise<any[]> {
        return await this.gameService.searchGames(queries);
    }
}

