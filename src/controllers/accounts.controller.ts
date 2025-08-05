import { NextFunction, Request, Response } from "express";
import AccountService from "../services/account.service";
import { sendResSuccess } from "../utils/SendResSuccess";
import { SuccessMsg } from "../constants/successMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";

import { cloudinaryUpload } from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import AccountRepository from "../repositories/account.reposetory";
import { mapUserToRes } from "../mappers/user.mapper";

class AccountController {
  private accountService = new AccountService();
  private accountRepository = new AccountRepository();
  //define method
  public getDataUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.decript.id;
      const user = await this.accountService.getDataUser(userId);
      const couponUser = await this.accountRepository.getUserCoupon(userId);
      const pointUser = await this.accountRepository.getPoint(userId);

      if (user) {
        sendResSuccess(
          res,
          SuccessMsg.OK,
          StatusCode.OK,
          mapUserToRes(
            user,
            couponUser?.discount || null,
            couponUser?.expiresAt,
            pointUser.totalPoint,
            pointUser.soonestExpiry
          )
        );
      }
    } catch (error) {
      next(error);
    }
  };
  public updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = res.locals.decript.id;
      let upload: UploadApiResponse | undefined;
      if (req.file) {
        upload = await cloudinaryUpload(req.file);
      }
      const user = await this.accountService.updateProfile(id, {
        ...req.body,
        profileImage: upload?.secure_url,
      });
      if (user) {
        sendResSuccess(res, SuccessMsg.UPDATE_DATA_USER, StatusCode.OK, user);
      }
    } catch (error) {
      next(error);
    }
  };
  public uploadProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = res.locals.decript.id;
      let upload: UploadApiResponse | undefined;
      if (req.file) {
        upload = await cloudinaryUpload(req.file);
      }
      const user = await this.accountService.updateProfile(id, {
        ...req.body,
        profileImage: upload?.secure_url,
      });
      if (user) {
        sendResSuccess(res, SuccessMsg.UPDATE_DATA_USER, StatusCode.OK, user);
      }
    } catch (error) {
      next(error);
    }
  };
  public changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.decript.id;
      const { oldPassword, newPassWord } = req.body;
      await this.accountService.gantiPassword(userId, oldPassword, newPassWord);

      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };
}
export default AccountController;
