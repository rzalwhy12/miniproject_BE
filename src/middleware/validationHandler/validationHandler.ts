import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import AppError from "../../errors/AppError";
import { StatusCode } from "../../constants/statusCode.enum";
import { ErrorMsg } from "../../constants/errorMessage.enum";

export const validationHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errorValidation = validationResult(req);

    if (!errorValidation.isEmpty()) {
      const msgArrayError = errorValidation.array()[0].msg as string;

      throw new AppError(msgArrayError, StatusCode.BAD_REQUEST);
    } else {
      //jika tidak error, next ke controller
      next();
    }
  } catch (error) {
    next(error);
  }
};
