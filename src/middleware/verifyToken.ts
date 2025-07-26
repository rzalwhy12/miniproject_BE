import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import { verify } from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("no token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("token not found", 401); //401 masalah autentikasi
    }
    if (!process.env.TOKEN_KEY) {
      throw new AppError("server error missing secret key", 500);
    }
    const checkToken = verify(token, process.env.TOKEN_KEY);

    res.locals.decript = checkToken;
  } catch (error) {
    next(error);
  }
};
