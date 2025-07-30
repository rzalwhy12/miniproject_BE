import { NextFunction, Request, Response } from "express";
import AuthServices from "../services/auth.services";
import AppError from "../errors/AppError";
import { SuccessMsg } from "../constants/successMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";
import { ErrorMsg } from "../constants/errorMessage.enum";
import { sendResSuccess } from "../utils/sendResSuccess";
import { mapUserToDTO } from "../mappers/user.mapper";

//controller tugasnya unutk mengirim response saja
class AuthController {
  private authService = new AuthServices();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.signUp(req.body);
      sendResSuccess(res, SuccessMsg.USER_CREATED, StatusCode.CREATED);
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
      const isExist = await this.authService.isExist(req.body);
      if (isExist) {
        throw new AppError(ErrorMsg.EMAIL_ALREADY_USED, StatusCode.CONFLICT);
      }
      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK);
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
      const isExist = await this.authService.isExist(req.body);
      console.log(isExist);
      if (isExist) {
        throw new AppError(ErrorMsg.USERNAME_ALREADY_USED, StatusCode.CONFLICT);
      }
      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, username, password } = req.body;
      const data = await this.authService.loginUser(
        { email, username },
        password
      );

      if (data.comparePassword) {
        sendResSuccess(
          res,
          SuccessMsg.USER_LOGGED_IN,
          StatusCode.OK,
          mapUserToDTO(data.user)
        );
      }
      throw new AppError(
        ErrorMsg.INVALID_EMAIL_OR_PASSWORD,
        StatusCode.NOT_FOUND
      );
    } catch (error) {
      next(error);
    }
  };

  public verifyUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const isVerify = await this.authService.verifyUser(res.locals.decript);
      sendResSuccess(res, SuccessMsg.EMAIL_VERIFIED, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
