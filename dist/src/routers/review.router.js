"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = __importDefault(require("../controllers/review.controller"));
const verifyToken_1 = require("../middleware/verifyToken");
class ReviewRouter {
    //end controller deklarasi
    constructor() {
        //start kontroler deklarasi
        this.reviewController = new review_controller_1.default();
        this.initializeRouter = () => {
            this.route.get("/event/:eventId", this.reviewController.getReviewsByEvent);
            this.route.use(verifyToken_1.verifyToken); //semua yang perlu verifyToken dibawah sini
            this.route.post("/create", this.reviewController.createReview);
        };
        this.getRouter = () => {
            return this.route;
        };
        //inisialisasi
        this.route = (0, express_1.Router)();
        this.initializeRouter();
    }
}
exports.default = ReviewRouter;
