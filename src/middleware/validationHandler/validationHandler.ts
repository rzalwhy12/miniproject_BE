import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import AppError from "../../errors/AppError";
import { StatusCode } from "../../constants/statusCode.enum";
import { IvalidationError } from "../../types/errorValidation.type";
import { ErrorMsg } from "../../constants/errorMessage.enum";

export const validationHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errorValidation = validationResult(req);

    if (!errorValidation.isEmpty()) {
      const msgArrayError: IvalidationError[] = errorValidation
        .array()
        .map((error) => ({
          field: error.msg,
        }));

      throw new AppError(
        ErrorMsg.INVALID_INPUT,
        StatusCode.BAD_REQUEST,
        msgArrayError
      );
    } else {
      //jika tidak error next ke controller
      next();
    }
  } catch (error) {
    next(error);
  }
};
