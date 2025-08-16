import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { uploadMemory } from "../middleware/uploader";
import EventValidator from "../middleware/validations/event.validator";
import EventConttroller from "../controllers/event.controller";
import ReportingController from "../controllers/reporting.controller";

class ReportingRouter {
  private route: Router;

  //start kontroler deklarasi
  private eventController = new EventConttroller();
  private reportingController = new ReportingController();
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
    this.route.get("/reporting/:slug", this.reportingController.reporting);
    this.route.get("/all", this.reportingController.reportingAll); // Data mingguan
  };

  public getRouter = () => {
    return this.route;
  };
}

export default ReportingRouter;
