import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { HttpModule } from "@nestjs/axios";
import { GameController } from "./game.controller";
import { GameApi } from "./game.api";
import { GameService } from "./game.service";

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
    ],
    controllers: [GameController],
    providers: [GameService, GameApi, PrismaService],
})
export class GameModule { }

