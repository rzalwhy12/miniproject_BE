import TransactionService from "../services/transaction.service";
import { NextFunction, Request, Response } from "express";
import { IOrderCreateReq } from "../dto/transacionReq.dto";
import { StatusCode } from "../constants/statusCode.enum";
import AppError from "../errors/AppError";
import { ErrorMsg } from "../constants/errorMessage.enum";
import { sendResSuccess } from "../utils/SendResSuccess";
import { SuccessMsg } from "../constants/successMessage.enum";

class TransactionController {
  private transactionService = new TransactionService();

  public orderItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.decript.id;
      if (!userId) {
        throw new AppError(ErrorMsg.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }
      const data: IOrderCreateReq = req.body;
      const result = await this.transactionService.orderItem(userId, data);
      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, result);
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionController;
