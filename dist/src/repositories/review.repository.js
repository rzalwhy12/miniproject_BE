"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const prisma_1 = require("../config/prisma");
class ReviewRepository {
    async createReview(data) {
        return await prisma_1.prisma.review.create({
            data,
        });
    }
    async getReviewsByEvent(eventId) {
        return await prisma_1.prisma.review.findMany({
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
exports.ReviewRepository = ReviewRepository;
exports.default = new ReviewRepository();
