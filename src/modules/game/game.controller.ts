import { Controller, Get, Param, Query } from "@nestjs/common";
import { GameService } from "./game.service";
import { Public } from "../auth/auth.guard";
import { Game } from "@prisma/client";
import { SearchGameDTO } from "./game.dtos";

@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Public()
    @Get('/')
    async getAllGames(): Promise<Game[]> {
        return await this.gameService.getAllGames();
    }

    @Get('/details/:id')
    async getGameById(
        @Param('id') id: string
    ): Promise<Game> {
        return await this.gameService.getGameById(parseInt(id));
    }

    @Get('/search')
    async searchGames(
        @Query() queries: SearchGameDTO 
    ): Promise<any[]> {
        return await this.gameService.searchGames(queries);
    }
}

