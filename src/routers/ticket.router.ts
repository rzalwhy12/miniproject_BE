import { Router } from "express";
import TicketController from "../controllers/ticket.controller";

class TicketRouter {
    private route: Router;
    private ticketController = new TicketController();

    constructor() {
        this.route = Router();
        this.initializeRouter();
    }

    private initializeRouter = (): void => {
        this.route.get("/:ticketTypeId", this.ticketController.getTicketById);
    };

    public getRouter = () => {
        return this.route;
    };
}

export default TicketRouter;
