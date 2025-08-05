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
    // Public routes (no auth required)
    this.route.get("/", this.eventController.getEvent); // Get all events
    this.route.get("/:slug", this.eventController.getEvent); // Get event by slug

    this.route.use(verifyToken); //semua yang perlu verifyToken dibawah sini
    this.route.get("/my-event", this.eventController.getMyEvent); // This must come before /:eventId
    this.route.get("/:eventId", this.eventController.getEvent); // Get event by ID
    
    this.route.post(
      "/create",
      this.eventValidator.createEventValidator,
      this.eventController.createEvent
    );
    //route upload banner dipakai barengan sama create atau update
    this.route.patch(
      "/banner/:eventId",
      uploadMemory().single("banner"),
      this.eventController.uploadBanner
    );
    this.route.patch(
      "/update/:eventId",
      this.eventValidator.createEventValidator,
      this.eventController.updateEvent
    );
    this.route.delete("/delete/:eventId", this.eventController.deleteEvent);
  };

  public getRouter = () => {
    return this.route;
  };
}

export default EventRouter;
