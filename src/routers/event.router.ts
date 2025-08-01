import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { uploadMemory } from "../middleware/uploader";
import EventValidator from "../middleware/validations/event.validator";
import EventConttroller from "../controllers/event.controller";

class EventRouter {
    private route: Router;

    //start kontroler deklarasi
    private eventController = new EventConttroller();
    //end controller deklarasi

    //start middleware deklarasi
    private eventValidator = new EventValidator();
    //end middleware deklarasi

    constructor() {
        //inisialisasi
        this.route = Router();
        this.initializeRouter();
    }
    private initializeRouter = (): void => {
        this.route.use(verifyToken); //semua yang perlu verifyToken dibawah sini
        this.route.post(
            "/create",
            this.eventValidator.createEventValidator,
            this.eventController.createEvent
        );
        this.route.patch(
            "/banner/:eventId",
            uploadMemory().single("banner"),
            this.eventController.uploadBanner
        );
    };

    public getRouter = () => {
        return this.route;
    };
}

export default EventRouter;
