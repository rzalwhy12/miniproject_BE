import { NextFunction, Request, Response } from "express";
import AccountService from "../services/account.service";
import { sendResSuccess } from "../utils/SendResSuccess";
import { SuccessMsg } from "../constants/successMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";
import { mapUserToDTO } from "../mappers/user.mapper";
import { cloudinaryUpload } from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

class AccountController {
  private accountService = new AccountService();
  //define method
  public getDataUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = res.locals.decript.id;
      const user = await this.accountService.getDataUser(id);
      if (user) {
        sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, mapUserToDTO(user));
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
}
export default AccountController;
