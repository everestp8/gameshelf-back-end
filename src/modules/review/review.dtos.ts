import { Prisma, Review } from "@prisma/client";
import { IsNumber, IsString, Max, Min } from "class-validator";

export class CreateReviewDTO {
    @IsString()
    title: string;
    @IsString()
    content: string;
    @IsNumber()
    @Max(10) @Min(0)
    rating: number;
    @IsString()
    gameId: string;
}

export interface ReadReviewDTO {
    id: string;
    title: string;
    content: string;
    rating: number;
    gameId: string;
    authoredBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export function fromCreateReviewDTO(dto: CreateReviewDTO, authorId: string): Prisma.ReviewCreateInput {
    return {
        title: dto.title,
        content: dto.content,
        rating: Prisma.Decimal(dto.rating),
        game: { connect: { id: dto.gameId } },
        author: { connect: { id: authorId } }
    };
}

export function toReadReviewDTO(review: Review, authoredBy: string): ReadReviewDTO {
    return {
        id: review.id,
        title: review.title,
        content: review.content,
        rating: review.rating.toNumber(),
        gameId: review.gameId,
        authoredBy: authoredBy,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
    };
}

