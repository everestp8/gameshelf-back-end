import { Injectable } from "@nestjs/common";
import { CreateReviewDTO, fromCreateReviewDTO, toReadReviewDTO, type ReadReviewDTO } from "./review.dtos";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReviewService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async getAuthorName(authorId: string): Promise<string> {
        const user = await this.prismaService.user.findUnique({
            where: { id: authorId },
            select: { name: true },
        });
        return user?.name || 'Unknown';
    }

    async create(review: CreateReviewDTO, authorId: string): Promise<ReadReviewDTO> {
        await this.ensureGameExists(review.gameId);
        return this.prismaService.review.create({
            data: fromCreateReviewDTO(review, authorId)
        }).then(async r => toReadReviewDTO(r, await this.getAuthorName(authorId)));
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
        const reviews = await this.prismaService.review.findMany({
            where: { authorId },
        });

        return Promise.all(
            reviews.map(async r =>
                toReadReviewDTO(r, await this.getAuthorName(r.authorId))
            )
        );
    }

    async findByGameId(gameId: string): Promise<ReadReviewDTO[]> {
        const reviews = await this.prismaService.review.findMany({
            where: { gameId },
        });

        return Promise.all(
            reviews.map(async r =>
                toReadReviewDTO(r, await this.getAuthorName(r.authorId))
            )
        );
    }

    async deleteByUserId(authorId: string, reviewId: string): Promise<ReadReviewDTO> {
        const review = await this.prismaService.review.delete({
            where: {
                id: reviewId,
                authorId: authorId,
            },
        });

        return toReadReviewDTO(review, await this.getAuthorName(authorId));
    }
}
