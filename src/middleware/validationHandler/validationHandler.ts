import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import AppError from "../../errors/AppError";

export const validationHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errorValidation = validationResult(req);

    if (!errorValidation.isEmpty()) {
      throw new AppError("validation failed", 400, errorValidation);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};
