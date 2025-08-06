
import { Router } from "express";
import VoucherController from "../controllers/voucher.controller";
import { verifyToken } from "../middleware/verifyToken";

class VoucherRouter {
    private route: Router;
    private voucherController = new VoucherController();

    constructor() {
        this.route = Router();
        this.initializeRouter();
    }

    private initializeRouter = (): void => {
    this.route.post("/apply", verifyToken, this.voucherController.applyVoucher);
    this.route.get("/", this.voucherController.getVouchers);
    this.route.get("/event/:eventId", this.voucherController.getVouchersByEventId);
    };

    public getRouter = () => {
        return this.route;
    };
}

export default VoucherRouter;
