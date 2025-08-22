"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const review_repository_1 = __importDefault(require("../repositories/review.repository"));
class ReviewService {
    async createReview(eventId, userId, rating, comment) {
        return await review_repository_1.default.createReview({ eventId, userId, rating, comment });
    }
    async getReviewsByEvent(eventId) {
        return await review_repository_1.default.getReviewsByEvent(eventId);
    }
}
exports.ReviewService = ReviewService;
exports.default = new ReviewService();
