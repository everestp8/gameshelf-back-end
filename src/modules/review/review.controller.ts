import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDTO, ReadReviewDTO } from "./review.dtos";

@Controller('reviews')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService
    ) {}

    @Get('/me')
    listByUserId(
        @Req() req: { user: { sub: string } }
    ): Promise<ReadReviewDTO[]> {
        return this.reviewService.findByUserId(req.user.sub);
    }

    @Get('/')
    listByGameId(
        @Query() queries: { gameId?: string, userId?: string }
    ): Promise<ReadReviewDTO[]> {
        if (queries.userId)
            return this.reviewService.findByUserId(queries.userId);
        if (queries.gameId)
            return this.reviewService.findByGameId(queries.gameId);
        return Promise.resolve([]);
    }

    @Post('/')
    create(
        @Body() review: CreateReviewDTO,
        @Req() req: { user: { sub: string } }
    ): Promise<ReadReviewDTO> {
        return this.reviewService.create(review, req.user.sub);
    }
}
