import { Router } from "express";
import ReviewController from "../controllers/review.controller";
import { verifyToken } from "../middleware/verifyToken";

class ReviewRouter {
    private route: Router;

    //start kontroler deklarasi
    private reviewController = new ReviewController();
    //end controller deklarasi

    constructor() {
        //inisialisasi
        this.route = Router();
        this.initializeRouter();
    }
    private initializeRouter = (): void => {
        this.route.get("/event/:eventId", this.reviewController.getReviewsByEvent);
        this.route.use(verifyToken); //semua yang perlu verifyToken dibawah sini
        this.route.post("/create",this.reviewController.createReview);
    };

    public getRouter = () => {
        return this.route;
    };
}

export default ReviewRouter;
