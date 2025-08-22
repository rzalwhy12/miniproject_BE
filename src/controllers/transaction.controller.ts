import TransactionService from "../services/transaction.service";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCode.enum";
import AppError from "../errors/AppError";
import { ErrorMsg } from "../constants/errorMessage.enum";
import { sendResSuccess } from "../utils/SendResSuccess";
import { SuccessMsg } from "../constants/successMessage.enum";
import { RoleName, TransactionStatus } from "../../prisma/generated/client";
import TransactionRepository from "../repositories/transaction.repository";
import { cloudinaryUpload } from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { mapOrderListToRes } from "../mappers/transaction.mapper";

class TransactionController {
  public getTransactionsByUserIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.decript.id;
      if (!userId) {
        throw new AppError(ErrorMsg.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }
      const transactions = await this.transactionService.fetchTransactionsByUserId(userId);
      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, transactions);
    } catch (error) {
      next(error);
    }
  };
  public getTransactionByCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { transactionCode } = req.params;
      const transaction = await this.transactionService.getTransactionByCode(transactionCode);
      if (!transaction) {
        throw new AppError("Transaction not found", StatusCode.NOT_FOUND);
      }
      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, transaction);
    } catch (error) {
      next(error);
    }
  };
  private transactionService = new TransactionService();
  private transactionRepository = new TransactionRepository();
  public transaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.decript.id;
      const userRole = res.locals.decript.activeRole;
      const eventId = req.body.eventId;
      if (!userId) {
        throw new AppError(ErrorMsg.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }
      const event = await this.transactionRepository.findEventId(eventId);
      if (userId === event?.organizerId) {
        throw new AppError(
          "Organizer Cannot Create Transaction",
          StatusCode.BAD_REQUEST
        );
      }
      if (userRole === RoleName.ORGANIZER) {
        throw new AppError("Please switch to customer", StatusCode.BAD_REQUEST);
      }
      const result = await this.transactionService.createTransaction(
        userId,
        req.body
      );
      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, result);
    } catch (error) {
      next(error);
    }
  };
  public cutomerUploadProof = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const transactionId = parseInt(req.params.transactionId);
      const customerId = res.locals.decript.id;
      if (res.locals.decript.activeRole !== RoleName.CUSTOMER) {
        throw new AppError(ErrorMsg.MUST_BE_CUSTOMER, StatusCode.UNAUTHORIZED);
      }
      const alreadyUpload = await this.transactionRepository.findTransaction(
        transactionId
      );
      if (alreadyUpload?.paymentProof) {
        throw new AppError("Already Upload", StatusCode.BAD_REQUEST);
      }
      let upload: UploadApiResponse | undefined;
      if (req.file) {
        upload = await cloudinaryUpload(req.file);
      }
      if (!upload?.secure_url) {
        throw new AppError(
          "Server Cannot Upload File",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }
      const uploadedProof = await this.transactionService.uploadProofPayment(
        transactionId,
        upload.secure_url,
        customerId
      );
      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, uploadedProof);
    } catch (error) {
      next(error);
    }
  };
  public organizerResponse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const transactionId = parseInt(req.params.transactionId);
      const { status } = req.body;
      const organizerId = res.locals.decript.id;

      if (res.locals.decript.activeRole !== RoleName.ORGANIZER) {
        throw new AppError(ErrorMsg.MUST_BE_ORGANIZER, StatusCode.UNAUTHORIZED);
      }

      if (isNaN(transactionId)) {
        throw new AppError(
          "transactionId harus berupa angka",
          StatusCode.BAD_REQUEST
        );
      }

      const allowedStatus = [
        TransactionStatus.DONE,
        TransactionStatus.REJECTED,
      ];

      if (!allowedStatus.includes(status)) {
        throw new AppError(
          "Status transaksi tidak valid",
          StatusCode.BAD_REQUEST
        );
      }

      const transaction = await this.transactionService.organizerResponse(
        status,
        transactionId,
        organizerId
      );

      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, transaction);
    } catch (error) {
      next(error);
    }
  };
  public getTransactionOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organizerId = res.locals.decript.id;

      const transaction = await this.transactionService.getListOrder(
        organizerId
      );
      sendResSuccess(
        res,
        SuccessMsg.OK,
        StatusCode.OK,
        mapOrderListToRes(transaction)
      );
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionController;
