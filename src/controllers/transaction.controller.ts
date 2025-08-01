import TransactionService from "../services/transaction.service";
import { Request, Response } from "express";
import { IOrderCreateReq } from "../dto/transacionReq.dto";

class TransactionController {
  private transactionService = new TransactionService();

  public orderItem = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user; // casting agar tidak error typescript
      if (!user || !user.id) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      const userId = user.id;
      const data: IOrderCreateReq = req.body;
      const result = await this.transactionService.orderItem(userId, data);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default TransactionController;
