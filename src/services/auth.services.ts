import { prisma } from "../config/prisma";
import { IIsExist, ISignUpDTO } from "../dto/user/user.Request.dto.";
import { User } from "../../prisma/generated/client";
import AuthRepository from "../repositories/auth.repository";
import AppError from "../errors/AppError";
import { ErrorMsg } from "../constants/errorMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";
import { compare } from "bcrypt";

//logicnya di service
class AuthServices {
  //define class
  private authRepository = new AuthRepository();

  //method define
  public signUp = async (dataSignUp: ISignUpDTO) => {
    const newUser = this.authRepository.createUser(dataSignUp);
    return newUser;
  };

  //live isexist email dan username service
  public isExist = async (field: IIsExist) => {
    const isExist = await this.authRepository.findAccount(field);
    return isExist;
  };

  public loginUser = async (dataLogin: IIsExist, passwordBody: string) => {
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

  public verifyUser = async (id: string) => {
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
