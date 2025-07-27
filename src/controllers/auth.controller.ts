import { NextFunction, Request, Response } from "express";
import AuthServices from "../services/auth.services";
import AppError from "../errors/AppError";
import { SuccessMsg } from "../constants/successMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";
import { ErrorMsg } from "../constants/errorMessage.enum";
import SendResSuccess from "../utils/SendResSuccess";
import { mapUserToDTO } from "../mappers/user.mapper";
import { compare } from "bcrypt";

class AuthController {
  private authService: AuthServices;

  //resSendSuccess
  private sendResSuccess: SendResSuccess;

  constructor() {
    this.authService = new AuthServices();
    this.sendResSuccess = new SendResSuccess();
  }

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = await this.authService.signUp(req.body);
      this.sendResSuccess.sendDataUser(
        res,
        SuccessMsg.USER_CREATED,
        StatusCode.CREATED,
        mapUserToDTO(newUser)
      );
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
      const isExist = await this.authService.isEmailExist(req.params.email);
      if (isExist) {
        throw new AppError(ErrorMsg.EMAIL_ALREADY_USED, StatusCode.CONFLICT);
      }
      this.sendResSuccess.generalMessage(res, SuccessMsg.OK, StatusCode.OK);
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
      const isExist = await this.authService.isUsernameExist(
        req.params.username
      );
      if (isExist) {
        throw new AppError(ErrorMsg.USERNAME_ALREADY_USED, StatusCode.CONFLICT);
      }
      this.sendResSuccess.generalMessage(res, SuccessMsg.OK, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.loginUser(req.body);
      if (!user) {
        throw new AppError(
          ErrorMsg.INVALID_EMAIL_OR_PASSWORD,
          StatusCode.NOT_FOUND
        );
      }
      const comparePassword = await compare(req.body.password, user.password);
      if (comparePassword) {
        this.sendResSuccess.sendDataUser(
          res,
          SuccessMsg.USER_LOGGED_IN,
          StatusCode.OK,
          mapUserToDTO(user)
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
      this.sendResSuccess.generalMessage(
        res,
        SuccessMsg.EMAIL_VERIFIED,
        StatusCode.OK
      );
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
