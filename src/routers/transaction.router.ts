import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import TransactionController from "../controllers/transaction.controller";
import { uploadMemory } from "../middleware/uploader";

class TransactionRouter {
  private route: Router;
  private transactionController = new TransactionController();

  constructor() {
    this.route = Router();
    this.initializeRouter();
  }

  private initializeRouter = (): void => {
    this.route.use(verifyToken);
    this.route.post("/create", this.transactionController.transaction);
    this.route.patch(
      "/upload-payment/:transactionId",
      uploadMemory().single("paymentProof"),
      this.transactionController.cutomerUploadProof
    );
    this.route.patch(
      "/confirmation/:transactionId",
      this.transactionController.organizerResponse
    );
    this.route.get(
      "/order-list",
      this.transactionController.getTransactionOrder
    );
    this.route.get(
      "/user-transactions",
      this.transactionController.getTransactionsByUserIdController
    );
    this.route.get(
      "/:transactionCode",
      this.transactionController.getTransactionByCode
    );
  };

  public getRouter = () => {
    return this.route;
  };
}

export default TransactionRouter;
