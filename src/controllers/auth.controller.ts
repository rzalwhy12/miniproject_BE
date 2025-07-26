import { NextFunction, Request, Response } from "express";
import AuthServices from "../services/auth.services";
import { successRes } from "../utils/response";
import AppError from "../errors/AppError";
import { SuccessMsg } from "../constants/successMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";
import { ErrorMsg } from "../constants/errorMessage.enum";

class AuthController {
  private authService: AuthServices;

  constructor() {
    this.authService = new AuthServices();
  }

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = await this.authService.signUp(req.body);
      successRes(res, SuccessMsg.USER_CREATED, StatusCode.CREATED, newUser);
    } catch (error) {
      next(error);
    }
  };

  //live check exist email dan username controller
  public isEmailExist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (await this.authService.isEmailExist(req.params.email)) {
        throw new AppError(ErrorMsg.EMAIL_ALREADY_USED, StatusCode.CONFLICT);
      }
      successRes(res, SuccessMsg.OK, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  public isUsernameExist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (await this.authService.isUsernameExist(req.params.username)) {
        throw new AppError(ErrorMsg.USERNAME_ALREADY_USED, StatusCode.CONFLICT);
      }
      successRes(res, SuccessMsg.OK, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
