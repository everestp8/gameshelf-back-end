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
        @Query() queries: { ranking: string }
    ): Promise<GameSummaryDTO[]> {
        if (queries.ranking === 'most-reviewed')
            return await this.gameService.mostReviewedGames();
        if (queries.ranking === 'best-rated')
            return await this.gameService.bestRatedGames();

        return await this.gameService.getAllGames();
    }

    @Get('/details/:id')
    async getGameById(
        @Param('id') id: string
    ): Promise<GameDetailsDTO> {
        return await this.gameService.fetchGameDetails(id);
    }

    @Get('/rawg/:id')
    async getGameByIdInRawg(
        @Param('id') id: string
    ): Promise<GameDetailsDTO> {
        return await this.gameService.fetchGameInRawg(parseInt(id));
    }

    @Get('/search')
    async searchGames(
        @Query() queries: SearchGameDTO 
    ): Promise<any[]> {
        return await this.gameService.searchGames(queries);
    }
}

