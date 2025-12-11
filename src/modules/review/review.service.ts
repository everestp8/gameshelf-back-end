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
        return this.prismaService.review.create({
            data: fromCreateReviewDTO(review, authorId)
        }).then(async r => toReadReviewDTO(r, await this.getAuthorName(authorId)));
    }

    async findByUserId(authorId: string): Promise<ReadReviewDTO[]> {
        return this.prismaService.review.findMany({
            where: { authorId },
            include: {
                author: {select: { id: true, name: true }},
                game: {select: { id: true, title: true }}
            }
        }).then(async reviews => Promise.all(reviews.map(async review => toReadReviewDTO(review, await this.getAuthorName(review.authorId)))));
    }

    async findByGameId(gameId: string): Promise<ReadReviewDTO[]> {
        return this.prismaService.review.findMany({
            where: { gameId },
            include: {
                author: {select: { id: true, name: true }},
                game: {select: { id: true, title: true }}
            }
        }).then(async reviews => Promise.all(reviews.map(async review => toReadReviewDTO(review, await this.getAuthorName(review.authorId)))));
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

