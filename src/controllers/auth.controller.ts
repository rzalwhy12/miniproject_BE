import { NextFunction, Request, Response } from "express";
import AuthServices from "../services/auth.services";
import { successResponse } from "../utils/response";
import AppError from "../errors/AppError";

class AuthController {
  private authService: AuthServices;

  constructor() {
    this.authService = new AuthServices();
  }

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = await this.authService.signUp(req.body);
      if (!newUser) {
        throw new AppError("gagal daftar", 500);
      }
      successResponse(res, newUser, "user created", 201);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
