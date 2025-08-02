import { prisma } from "../config/prisma";
import { IFindAccount, ISignUpDTO } from "../dto/req/userReq.dto";
import AuthRepository from "../repositories/auth.repository";
import AppError from "../errors/AppError";
import { ErrorMsg } from "../constants/errorMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";
import { compare } from "bcrypt";
import dayjs from "dayjs";
import { sendEmail } from "../utils/sendEmail";
import { verifyEmailTemplate } from "../template/verifyEmail.template";
import { generateToken } from "../utils/generateToken";
import { RoleName, User } from "../../prisma/generated/client";
import { resetPasswordTemplate } from "../template/resetPassword.template";

//logicnya di service
class AuthServices {
  //define class
  private authRepository = new AuthRepository();

  //method define
  public signUp = async (dataSignUp: ISignUpDTO) => {
    let newUser: User;
    const subject = "Verify Your Email";
    //if daftar tanpa referral
    if (!dataSignUp.referralCode) {
      newUser = await this.authRepository.createUser(dataSignUp);
    } else {
      //pake referral
      const userGivenReferral = await this.authRepository.findAccount({
        referral: dataSignUp.referralCode,
      });
      if (!userGivenReferral) {
        throw new AppError(
          ErrorMsg.REFERRAL_GIVEN_NOT_FOUND,
          StatusCode.NOT_FOUND
        );
      }
      newUser = await this.authRepository.createUser(dataSignUp);
      const referral = await this.authRepository.addReferral({
        referrerId: userGivenReferral.id,
        referredId: newUser.id,
      });
      const expiresAt = dayjs().add(3, "month").toDate();
      await this.authRepository.addCoupon({
        discount: 10,
        expiresAt,
        referralId: referral.id,
      });
      //point ketika user memberikan referralnya 10.000
      await this.authRepository.addPoint({
        userId: userGivenReferral.id,
        amount: 10000,
        expiresAt,
      });
    }
    //after create send emailverify
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      isverified: newUser.isVerified,
      activeRole: RoleName.CUSTOMER,
      rememberMe: false,
    });
    if (!token) {
      throw new AppError(
        ErrorMsg.SERVER_MISSING_SECRET_KEY,
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
    const urlFE = `${process.env.BASIC_URL_FE}/verify/${token}`;
    sendEmail(newUser.email, subject, verifyEmailTemplate(newUser.name, urlFE));
    await this.authRepository.addRole(newUser.id);
    console.log(newUser);
    return newUser;
  };
  //live isexist email dan username service
  public isExist = async (field: IFindAccount) => {
    const isExist = await this.authRepository.findAccount(field);
    return isExist;
  };

  public loginUser = async (dataLogin: IFindAccount, passwordBody: string) => {
    const user = await this.authRepository.findAccount(dataLogin);
    if (!user) {
      throw new AppError(
        ErrorMsg.INVALID_EMAIL_OR_PASSWORD,
        StatusCode.NOT_FOUND
      );
    }
    const comparePassword = await compare(passwordBody, user.password);
    return { user, comparePassword };
  };

  public verifyUser = async (id: number) => {
    const isVerify = !!(await prisma.user.update({
      where: {
        id,
      },
      data: {
        isVerified: true,
      },
    }));
    return isVerify;
  };
  public keepLogin = async (id: number) => {
    const user = await this.authRepository.findAccount({
      id,
    });
    return user;
  };
  public forgetPassword = async (email: string) => {
    const user = await this.authRepository.findAccount({
      email,
    });
    if (!user) {
      throw new AppError(ErrorMsg.EMAIL_NOT_FOUND, StatusCode.NOT_FOUND);
    }
    const token = generateToken({
      id: user.id,
      email: user.email,
      isverified: user.isVerified,
      activeRole: user.roles[0].role.name,
      rememberMe: false,
    });
    const urlFE: string = `${process.env.BASIC_URL_FE}/verify/${token}`;
    const subject: string = "Reset Your Password";
    sendEmail(user.email, subject, resetPasswordTemplate(user.name, urlFE));
    return user;
  };
  public resetPassword = async (id: number, password: string) => {
    const user = await this.authRepository.resetPassword(id, password);
    return user;
  };
}

export default AuthServices;
