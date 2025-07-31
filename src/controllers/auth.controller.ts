import { NextFunction, Request, Response } from "express";
import AuthServices from "../services/auth.services";
import AppError from "../errors/AppError";
import { SuccessMsg } from "../constants/successMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";
import { ErrorMsg } from "../constants/errorMessage.enum";
import { sendResSuccess } from "../utils/SendResSuccess";
import { mapUserToDTO } from "../mappers/user.mapper";
import { generateToken } from "../utils/generateToken";
import { RoleName } from "../../prisma/generated/client";
import { STATUS_CODES } from "http";
import App from "../app";

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

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, username, password, remeberMe } = req.body;
      const data = await this.authService.loginUser(
        { email, username },
        password
      );

      if (!data.comparePassword) {
        throw new AppError(
          ErrorMsg.INVALID_EMAIL_OR_PASSWORD,
          StatusCode.UNAUTHORIZED
        );
      }

      const token = generateToken(
        {
          id: data.user.id,
          email: data.user.email,
          isverified: data.user.isVerified,
          activeRole: RoleName.CUSTOMER,
        },
        remeberMe ? "7h" : "1h"
      );

      if (!token) {
        throw new AppError(
          ErrorMsg.INTERNAL_SERVER_ERROR,
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }
      console.log(data.user, token, req.body);

      sendResSuccess(
        res,
        SuccessMsg.USER_LOGGED_IN,
        StatusCode.OK,
        mapUserToDTO(data.user),
        token
      );
    } catch (err) {
      next(err);
    }
  };

  public verifyUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const isVerify = await this.authService.verifyUser(res.locals.decript.id);
      if (isVerify) {
        sendResSuccess(res, SuccessMsg.EMAIL_VERIFIED, StatusCode.OK);
      }
    } catch (error) {
      next(error);
    }
  };

  public keepLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.authService.keepLogin(res.locals.decript.id);
      if (!data) {
        throw new AppError(
          ErrorMsg.INTERNAL_SERVER_ERROR,
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }
      sendResSuccess(
        res,
        SuccessMsg.USER_LOGGED_IN,
        StatusCode.OK,
        mapUserToDTO(data)
      );
    } catch (error) {
      next(error);
    }
  };
  public forgetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.authService.forgetPassword(req.body.email);
      if (!user) {
        throw new AppError(
          ErrorMsg.INTERNAL_SERVER_ERROR,
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }
      sendResSuccess(res, SuccessMsg.OK, StatusCode.UNAUTHORIZED);
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.authService.resetPassword(
        res.locals.decript.id,
        req.body.password
      );
      if (!user) {
        throw new AppError(
          ErrorMsg.INTERNAL_SERVER_ERROR,
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }
      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
