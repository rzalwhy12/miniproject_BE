import { Request, Response, NextFunction } from "express";
import reviewService from "../services/review.service";
import { sendResSuccess } from "../utils/SendResSuccess";
import { StatusCode } from "../constants/statusCode.enum";
import { SuccessMsg } from "../constants/successMessage.enum";
import AppError from "../errors/AppError";

class ReviewController {
    public createReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = res.locals.decript.id;
            const { eventId, rating, comment } = req.body;
            if (!eventId || !rating) {
                throw new AppError("eventId and rating are required", StatusCode.BAD_REQUEST);
            }
            const review = await reviewService.createReview(eventId, userId, rating, comment);
            sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, review);
        } catch (error) {
            next(error);
        }
    };

    public getReviewsByEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const eventId = parseInt(req.params.eventId);
            if (isNaN(eventId)) {
                throw new AppError("Invalid eventId", StatusCode.BAD_REQUEST);
            }
            const reviews = await reviewService.getReviewsByEvent(eventId);
            sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, reviews);
        } catch (error) {
            next(error);
        }
    };
}

export default ReviewController;
