import { Injectable } from "@nestjs/common";
import { CreateReviewDTO, fromCreateReviewDTO, toReadReviewDTO, type ReadReviewDTO } from "./review.dtos";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReviewService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async create(review: CreateReviewDTO, authorId: string): Promise<ReadReviewDTO> {
        return this.prismaService.review.create({
            data: fromCreateReviewDTO(review, authorId)
        }).then(toReadReviewDTO);
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

