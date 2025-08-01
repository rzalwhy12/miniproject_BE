import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import TransactionController from "../controllers/transaction.controller";

class TransactionRouter {
  private route: Router;
  private transactionController = new TransactionController();

  constructor() {
    this.route = Router();
    this.initializeRouter();
  }

  private initializeRouter = (): void => {
    this.route.use(verifyToken);
    this.route.post("/order", this.transactionController.orderItem);
  };

  public getRouter = () => {
    return this.route;
  };
}

export default TransactionRouter;
