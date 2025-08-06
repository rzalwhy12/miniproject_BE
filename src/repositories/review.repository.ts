import { prisma } from "../config/prisma";

export class ReviewRepository {
    public async createReview(data: {
        eventId: number;
        userId: number;
        rating: number;
        comment: string;
    }) {
        return await prisma.review.create({
            data,
        });
    }

    public async getReviewsByEvent(eventId: number) {
        return await prisma.review.findMany({
            where: { eventId },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
}

export default new ReviewRepository();
