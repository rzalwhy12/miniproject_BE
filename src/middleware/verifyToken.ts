import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import { verify } from "jsonwebtoken";
import { ErrorMsg } from "../constants/errorMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(ErrorMsg.TOKEN_NOT_PROVIDED, StatusCode.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];
    console.log("run");
    console.log(token);

    if (!token) {
      throw new AppError(ErrorMsg.TOKEN_NOT_FOUND, StatusCode.UNAUTHORIZED);
    }
    console.log("run");
    console.log(token);
    if (!process.env.TOKEN_KEY) {
      throw new AppError(
        ErrorMsg.SERVER_MISSING_SECRET_KEY,
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
    const checkToken = verify(token, process.env.TOKEN_KEY);
    res.locals.decript = checkToken;
    next();
  } catch (error) {
    next(error);
  }
};
