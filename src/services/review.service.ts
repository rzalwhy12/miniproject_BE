import reviewRepository from "../repositories/review.repository";

export class ReviewService {
    public async createReview(eventId: number, userId: number, rating: number, comment: string) {
        return await reviewRepository.createReview({ eventId, userId, rating, comment });
    }

    public async getReviewsByEvent(eventId: number) {
        return await reviewRepository.getReviewsByEvent(eventId);
    }
}

export default new ReviewService();
