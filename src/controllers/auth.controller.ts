import { NextFunction, Request, Response } from "express";
import AuthServices from "../services/auth.service";
import AppError from "../errors/AppError";
import { SuccessMsg } from "../constants/successMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";
import { ErrorMsg } from "../constants/errorMessage.enum";
import { sendResSuccess } from "../utils/SendResSuccess";
import { mapUserToDTO } from "../mappers/user.mapper";
import { generateToken } from "../utils/generateToken";
import AuthRepository from "../repositories/auth.repository";
import App from "../app";

//controller tugasnya unutk mengirim response saja
class AuthController {
  private authService = new AuthServices();
  private authRepository = new AuthRepository();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.signUp(req.body);
      sendResSuccess(res, SuccessMsg.USER_CREATED, StatusCode.CREATED);
    } catch (error) {
      next(error);
    }
  };
  public logIn = async (req: Request, res: Response, next: NextFunction) => {
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
          activeRole: data.user.roles[0].role.name,
          rememberMe: remeberMe,
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
      console.log(user);
      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };
  public switchRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const targetRole = parseInt(req.params.role);

      if (isNaN(targetRole)) {
        throw new AppError(ErrorMsg.INVALID_ROLE_ID, StatusCode.BAD_REQUEST);
      }

      const userId = res.locals.decript.id;
      const remeberMe = res.locals.decript.remeberMe;
      // Switch role (ubah active role di DB)
      const newActiveRole = await this.authRepository.switchRoleRepo(
        userId,
        targetRole
      );

      if (!newActiveRole) {
        throw new AppError(
          ErrorMsg.INTERNAL_SERVER_ERROR,
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      // Ambil user lengkap dengan roles
      const user = await this.authRepository.findAccount({ id: userId });

      if (!user || !user.roles || user.roles.length === 0) {
        throw new AppError("User or role not found", StatusCode.NOT_FOUND);
      }

      // Buat token baru dengan role aktif yang baru
      const token = generateToken(
        {
          id: user.id,
          email: user.email,
          isverified: user.isVerified,
          activeRole: newActiveRole,
          rememberMe: remeberMe,
        },
        remeberMe ? "7h" : "1h"
      );

      if (!token) {
        throw new AppError(
          "Server Cannot Generate Token",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, newActiveRole, token);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
