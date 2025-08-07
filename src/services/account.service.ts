import { compare } from "bcrypt";
import { ErrorMsg } from "../constants/errorMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";
import { SuccessMsg } from "../constants/successMessage.enum";
import { IUpdateUser } from "../dto/req/userReq.dto";
import AppError from "../errors/AppError";
import AccountRepository from "../repositories/account.reposetory";
import { sendEmail } from "../utils/sendEmail";
import { verifyEmailTemplate } from "../template/verifyEmail.template";
import { generateToken } from "../utils/generateToken";

class AccountService {
  private accountRepository = new AccountRepository();
  //define method
  public updateProfile = async (id: number, dataUser: IUpdateUser) => {
    const user = await this.accountRepository.updateUser(id, dataUser);
    if (!user) {
      throw new AppError(
        "Cannot update profile",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
    return user;
  };
  public getDataUser = async (id: number) => {
    const user = await this.accountRepository.getDataUser(id);
    if (!user) {
      throw new AppError(ErrorMsg.CANNOT_GET_DATA, StatusCode.NOT_FOUND);
    }
    return user;
  };

  public async getCoupons(userId: number) {
    return await this.accountRepository.getCoupons(userId);
  }

  public gantiPassword = async (
    userId: number,
    oldPassword: string,
    newPassword: string
  ) => {
    const user = await this.accountRepository.getDataUser(userId);
    if (!user) {
      throw new AppError(
        "Cannot get data user",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
    const comparePass = await compare(oldPassword, user.password);

    if (!comparePass) {
      throw new AppError("Password incorrect", StatusCode.NOT_FOUND);
    }

    const updatePass = await this.accountRepository.newPassword(
      userId,
      newPassword
    );
    if (!updatePass) {
      throw new AppError("Cannot Change Password", StatusCode.BAD_REQUEST);
    }
    return updatePass;
  };
  public requestEmialVerify = async (userId: number) => {
    const user = await this.accountRepository.getDataUser(userId);
    if (!user) {
      throw new AppError("User Not Found", StatusCode.NOT_FOUND);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      isverified: user.isVerified,
      rememberMe: false,
    });
    if (!token) {
      throw new AppError(
        ErrorMsg.SERVER_MISSING_SECRET_KEY,
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
    const subject = "Verify Your Email";
    const urlFE = `${process.env.BASIC_URL_FE}/verify/${token}`;
    sendEmail(user.email, subject, verifyEmailTemplate(user.name, urlFE));
    return user;
  };
}

export default AccountService;
