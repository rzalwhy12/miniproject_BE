import { prisma } from "../config/prisma";
import { IFindAccount, ISignUpDTO } from "../dto/user/user.Request.dto.";
import AuthRepository from "../repositories/auth.repository";
import AppError from "../errors/AppError";
import { ErrorMsg } from "../constants/errorMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";
import { compare } from "bcrypt";
import dayjs from "dayjs";

//logicnya di service
class AuthServices {
  //define class
  private authRepository = new AuthRepository();

  //method define
  public signUp = async (dataSignUp: ISignUpDTO) => {
    const newUser = await this.authRepository.createUser(dataSignUp);
    if (!dataSignUp.referralCode) return newUser;
    const userGivenReferral = await this.authRepository.findAccount({
      referral: dataSignUp.referralCode,
    });
    if (!userGivenReferral)
      throw new AppError(
        ErrorMsg.REFERRAL_GIVEN_NOT_FOUND,
        StatusCode.NOT_FOUND
      );
    const referral = await this.authRepository.AddReferral({
      referrerId: userGivenReferral.id,
      referredId: newUser.id,
    });
    const expiresAt = dayjs().add(3, "month").toDate();
    await this.authRepository.AddCoupon({
      discount: 10,
      expiresAt,
      referralId: referral.id,
    });
    //point ketika user memberikan referralnya 10.000
    await this.authRepository.AddPoint({
      userId: userGivenReferral.id,
      amount: 10000,
      expiresAt,
    });
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
}

export default AuthServices;
