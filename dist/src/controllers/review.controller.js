"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_service_1 = __importDefault(require("../services/review.service"));
const SendResSuccess_1 = require("../utils/SendResSuccess");
const statusCode_enum_1 = require("../constants/statusCode.enum");
const successMessage_enum_1 = require("../constants/successMessage.enum");
const AppError_1 = __importDefault(require("../errors/AppError"));
class ReviewController {
    constructor() {
        this.createReview = async (req, res, next) => {
            try {
                const userId = res.locals.decript.id;
                const { eventId, rating, comment } = req.body;
                if (!eventId || !rating) {
                    throw new AppError_1.default("eventId and rating are required", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const review = await review_service_1.default.createReview(eventId, userId, rating, comment);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, review);
            }
            catch (error) {
                next(error);
            }
        };
        this.getReviewsByEvent = async (req, res, next) => {
            try {
                const eventId = parseInt(req.params.eventId);
                if (isNaN(eventId)) {
                    throw new AppError_1.default("Invalid eventId", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const reviews = await review_service_1.default.getReviewsByEvent(eventId);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, reviews);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = ReviewController;
