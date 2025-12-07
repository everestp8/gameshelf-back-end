import { Injectable } from "@nestjs/common";
import { CreateReviewDTO, fromCreateReviewDTO, toReadReviewDTO, type ReadReviewDTO } from "./review.dtos";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReviewService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async create(review: CreateReviewDTO, authorId: string): Promise<ReadReviewDTO> {
        await this.ensureGameExists(review.gameId);
        return this.prismaService.review.create({
            data: fromCreateReviewDTO(review, authorId)
        }).then(toReadReviewDTO);
    }

    private async ensureGameExists(gameId: string) {
        const existingGame = await this.prismaService.game.findUnique({
            where: { id: gameId }
        });

        if (existingGame) return existingGame;

        const RAWG_API_KEY = process.env.RAWG_API_KEY;
        const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`);
        if (!response.ok) {
            const text = await response.text();
            console.error("RAWG Error:", text);
            throw new Error(`Erro na RAWG API: ${response.status} - ${text}`);
        }

        const gameData = await response.json();

        if ((gameData as any).detail === "Not found.") {
            throw new Error(`Game ID ${gameId} não encontrado na API externo RAWG`);
        }

        return this.prismaService.game.create({
            data: {
                id: String(gameData.id),
                title: gameData.name,
                gameData: gameData
            }
        });
    }

    async findByUserId(authorId: string): Promise<ReadReviewDTO[]> {
        return this.prismaService.review.findMany({
            where: { authorId },
        }).then(reviews => reviews.map(toReadReviewDTO));
    }

    async findByGameId(gameId: string): Promise<ReadReviewDTO[]> {
        return this.prismaService.review.findMany({
            where: { gameId },
        }).then(reviews => reviews.map(toReadReviewDTO));
    }
}
